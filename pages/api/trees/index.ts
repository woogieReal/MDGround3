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

        // 아래에서 트리구조를 만들 때 pop()으로 마지막부터 꺼내기 때문에 ORDER BY를 역순으로 사용한다.
        query += `
          ORDER BY tree_type DESC, tree_name DESC
        `;

        const [rows, fields] = await connection.query(query, params);
        res.status(200).json(rows);
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
