import type { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "@/src/apis/dbConnection";
import { Connection } from "mysql2/promise";

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
          ORDER BY tree_path
        `);
        res.status(200).json(rows);
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
