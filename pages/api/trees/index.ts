import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection } from "mysql2/promise";
import { Tree } from "@/src/models/tree.model";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = _req;

  switch (method) {
    case "GET":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const [rows, fields] = await connection.query(`
          SELECT 
              tree_id AS treeId
            , tree_type AS treeType
            , tree_name AS treeName
            , tree_path AS treePath
            , delete_yn AS deleteYn
          FROM tree
          WHERE 1 = 1
          AND delete_yn = 'N'
          ORDER BY tree_path, FIELD(tree_type, 20, 10)
        `);

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
            console.log(parentTrees[parentTreeIndex]);
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
      res.status(200).json(body);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
