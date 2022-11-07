import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection } from "mysql2/promise";
import { Tree } from "@/src/models/tree.model";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { userId, treePath },
    body, 
    method 
  } = _req;

  switch (method) {
    case "GET":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        let query = '';
        let params: any[] = [];

        query += `
          SELECT 
              tree_id AS treeId
            , tree_type AS treeType
            , tree_name AS treeName
            , tree_path AS treePath
            , delete_yn AS deleteYn
          FROM tree
          WHERE user_id = ?
          AND delete_yn = 'N'
        `;

        params.push(userId);

        if (treePath) {
          query += `
            AND tree_path = ?
          `;
          params.push(treePath);
        }

        query += `
          ORDER BY tree_path, FIELD(tree_type, 20, 10)
        `;

        const [rows, fields] = await connection.query(query, params);

        const depthToTree = new Map();
        const trees: Tree[] = rows as Tree[];

        while (trees.length > 0) {
          const tree: Tree = trees.pop()!;
          const treeDepth = !!tree!.treePath
            ? tree!.treePath.split("|").length
            : 0;
          const depthTrees: Tree[] = depthToTree.get(treeDepth) || [];
          depthTrees.push(tree);
          depthToTree.set(treeDepth, depthTrees);
        }

        let depths: number[] = Array.from(depthToTree.keys());
        let maxDepth = Math.max(...depths);
        let minDepth = Math.min(...depths);

        while (maxDepth > minDepth) {
          const childTrees: Tree[] = depthToTree.get(maxDepth);
          const parentTrees: Tree[] = depthToTree.get(maxDepth - 1);

          childTrees.forEach((child: Tree) => {
            const parentTreeId = Number(child.treePath.split("|").pop());
            const parentTreeIndex = parentTrees.findIndex(
              (parent) => parent.treeId === parentTreeId
            );
            parentTrees[parentTreeIndex].treeChildren
              ? parentTrees[parentTreeIndex].treeChildren!.push(child)
              : (parentTrees[parentTreeIndex].treeChildren = [child]);
          });

          depthToTree.set(maxDepth - 1, parentTrees);
          maxDepth -= 1;
        }

        res.status(200).json(depthToTree.get(minDepth));
      });
      break;
    case "POST":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const request = JSON.parse(body)
        let query = '';
        let params: any[] = [];

        const [rows, fields] = await connection.execute(`
          SELECT MAX(IFNULL(t.tree_id, 0)) + 1 AS treeId
          FROM tree t 
          WHERE t.user_id = ?
        `, [request.userId]);

        const newTree: Tree = {
          ...(rows as { treeId: number; }[])[0],
          treeType: request.treeType,
          treeName: request.treeName,
          treeContent: request.treeContent,
          treePath: request.treePath,
          userId: request.userId,
        };

        query += `
          INSERT INTO tree 
            (
                tree_id
              , tree_type
              , tree_name
              , tree_content
              , tree_path
              , user_id
            )
          VALUES 
            (
                ?
              , ?
              , ?
              , ?
              , ?
              , ?
            )
        `;

        params.push(newTree.treeId);
        params.push(newTree.treeType);
        params.push(newTree.treeName);
        params.push(newTree.treeContent);
        params.push(newTree.treePath);
        params.push(newTree.userId);

        await connection.execute(query, params);
        res.status(200).json(newTree);
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
