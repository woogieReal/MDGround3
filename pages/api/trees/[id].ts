import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection, RowDataPacket } from "mysql2/promise";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, userId },
    body,
    method,
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
            , tree_content AS treeContent
            , tree_path AS treePath
            , delete_yn AS deleteYn
            , created_datetime AS createdDatetime
            , updated_datetime AS updatedDatetime
            , deleted_datetime AS deletedDatetime
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
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const request = JSON.parse(body)
        let query = '';
        let params: any[] = [];

        query += `
          UPDATE tree 
          SET updated_datetime = CURRENT_TIMESTAMP
        `;

        if (request.treeName) {
          query += ` , tree_name = ? `;
          params.push(request.treeName);
        }
        if (request.treeContent) {
          query += ` , tree_content = ? `;
          params.push(request.treeContent);
        }
        if (request.treePath) {
          query += ` , tree_path = ? `;
          params.push(request.treePath);
        }

        query += `
          WHERE user_id = ?
          AND tree_id = ?
        `;
        params.push(request.userId);
        params.push(id);

        const result = await connection.execute(query, params);
        res.status(200).json(result[0]);
      });
      break;
    case "DELETE":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const request = body;
        let query = '';
        let params: any[] = [];

        query += `
          UPDATE tree 
          SET delete_yn = 'Y'
            , deleted_datetime = CURRENT_TIMESTAMP
          WHERE user_id = ?
          AND tree_id = ?
        `;

        params.push(request.userId);
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
