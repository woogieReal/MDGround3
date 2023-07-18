import type { NextApiRequest, NextApiResponse } from "next";
import RDSConnection from "@/src/apis/rdsConnection";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import { createTreeFullPath } from "@/src/utils/tree/treeUtil";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, userId },
    body,
    method,
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
            , tree_content AS treeContent
            , tree_path AS treePath
            , delete_yn AS deleteYn
            , created_datetime AS createdDatetime
            , updated_datetime AS updatedDatetime
            , deleted_datetime AS deletedDatetime
            , user_id AS userId
          FROM tree
          WHERE user_id = ?
          AND delete_yn = 'N'
          AND tree_id = ?
          ORDER BY tree_path
        `;

        params.push(userId);
        params.push(id);

        const [rows, fields] = await connection.query(query, params);
        res.status(200).json((rows as RowDataPacket[])[0]);
      });
      break;
    case "PUT":
      RDSConnection.transactionExecutor(async (connection: Connection) => {
        const { treeId, treeName, treeContent, userId, treeStatus } = body as Tree;
        let query = '';
        let params: any[] = [];

        query += `
          UPDATE tree 
          SET updated_datetime = CURRENT_TIMESTAMP
        `;

        if (treeStatus === TreeStatusInfo.EDIT_CONTENT) {
            query += ` , tree_content = ? `;
            params.push(treeContent);
        } else if (treeStatus === TreeStatusInfo.RENAME) {
          query += ` , tree_name = ? `;
          params.push(treeName);
        }

        query += `
          WHERE user_id = ?
          AND tree_id = ?
        `;
        params.push(userId);
        params.push(id);

        const result = await connection.execute(query, params);
        res.status(200).json(result[0]);
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
