import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection, RowDataPacket } from "mysql2/promise";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body,
    method,
  } = _req;

  switch (method) {
    case "GET":
      DBConnection.transactionExecutor(async (connection: Connection) => {
        const [rows, fields] = await connection.query(`
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
          WHERE 1 = 1
          AND delete_yn = 'N'
          AND tree_id = ?
          ORDER BY tree_path
        `, [id]);
        res.status(200).json((rows as RowDataPacket[])[0]);
      });
      break;
    case "PUT":
      res.status(200).json(body);
      break;
    case "DELETE":
      res.status(200).json(id);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
