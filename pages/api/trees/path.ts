import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection } from "mysql2/promise";
import { MultiTreeCutOrCopy, Tree, TreeType } from "@/src/models/tree.model";
import { createTreeFullPath } from "@/src/utils/tree/treeUtil";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { userId, treePath },
    body, 
    method 
  } = _req;

  switch (method) {
    case "PUT":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const request: MultiTreeCutOrCopy = body;
        const { toTree, targetTreeList } = request;
        const newTreePath = createTreeFullPath(toTree);
        const response: any = [];

        targetTreeList.forEach(async (targetTree) => {
          const { treePath } = toTree;
          const { userId, treeId, treeType } = targetTree;
          let query = '';
          let params: any[] = [];
  
          query += `
            UPDATE tree 
            SET tree_path = ?
              , updated_datetime = CURRENT_TIMESTAMP
            WHERE user_id = ?
            AND tree_id = ?
          `;
  
          params.push(newTreePath);
          params.push(userId);
          params.push(treeId);
  
          if (treeType === TreeType.FORDER) {
            const treeFullPath = createTreeFullPath(targetTree);
  
            query += ';';
  
            query += `
              UPDATE tree 
              SET tree_path = ?
                , updated_datetime = CURRENT_TIMESTAMP
              WHERE user_id = ?
              AND tree_path LIKE CONCAT(?, '%')
              AND delete_yn <> 'Y'
            `;
            params.push(newTreePath);
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
