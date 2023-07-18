import type { NextApiRequest, NextApiResponse } from "next";
import RDSConnection from "@/src/apis/rdsConnection";
import { Connection } from "mysql2/promise";
import { Tree, TreeType } from "@/src/models/tree.model";
import { createTreeFullPath } from "@/src/utils/tree/treeUtil";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { userId, treePath },
    body, 
    method 
  } = _req;

  switch (method) {
    case "GET":
      RDSConnection.transactionExecutor(async (connection: Connection) => {
        let query = '';
        let params: any[] = [];

        query += `
          SELECT 
              tree_id AS treeId
            , tree_type AS treeType
            , tree_name AS treeName
            , tree_path AS treePath
            , delete_yn AS deleteYn
            , user_id AS userId
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
      RDSConnection.transactionExecutor(async (connection: Connection) => {
        // const request = JSON.parse(body)
        const { treeType, treeName, treeContent, treePath, userId } = body as Tree;
        let query = '';
        let params: any[] = [];

        const [rows, fields] = await connection.execute(`
          SELECT MAX(IFNULL(t.tree_id, 0)) + 1 AS treeId
          FROM tree t 
          WHERE t.user_id = ?
        `, [userId]);

        const newTree: Tree = {
          ...(rows as { treeId: number; }[])[0],
          treeType,
          treeName,
          treeContent,
          treePath,
          userId,
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
    case "DELETE":
      RDSConnection.transactionExecutor(async (connection: Connection) => {
        const request: Tree[] = body;
        const response: any = [];

        request.forEach(async (targetTree) => {
          const { userId, treeId, treeType } = targetTree;
          let query = '';
          let params: any[] = [];
  
          query += `
            UPDATE tree 
            SET delete_yn = 'Y'
              , deleted_datetime = CURRENT_TIMESTAMP
            WHERE user_id = ?
            AND tree_id = ?
          `;
  
          params.push(userId);
          params.push(treeId);
  
          if (treeType === TreeType.FORDER) {
            const treeFullPath = createTreeFullPath(targetTree);
  
            query += ';';
  
            query += `
              UPDATE tree 
              SET delete_yn = 'Y'
                , deleted_datetime = CURRENT_TIMESTAMP
              WHERE user_id = ?
              AND tree_path LIKE CONCAT(?, '%')
              AND delete_yn <> 'Y'
            `;
            params.push(userId);
            params.push(treeFullPath);
          }
  
          const result = await connection.query(query, params);
          response.push(result[0]);
        })

        res.status(200).json(response);
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
