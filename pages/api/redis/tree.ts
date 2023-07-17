import DBConnection from "@/src/apis/dbConnection";
import { Tree } from "@/src/models/tree.model";
import { appLogger } from "@/src/utils/common/loggerUtil";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { userId, key },
    body, 
    method 
  } = _req;

  switch (method) {
    case "GET":
      res.status(200).json("Hello");
      break;
    case "POST":
      DBConnection.transactionExecutor(async (connection, redisClient) => {
        const { treeIdList, userId } = body as { treeIdList: number[], userId: string };

        let query = '';
        let params: any[] = [];
        let result;

        console.log('treeIdList: ', treeIdList);
        for (const treeId of treeIdList) {
          const key = `${userId}-${treeId}`;
          const value = await redisClient.get(key);
          console.log('value: ', value);
          if (value) {
            query += `
              UPDATE tree 
              SET updated_datetime = CURRENT_TIMESTAMP
                , tree_content = ?
              WHERE user_id = ?
              AND tree_id = ?
              ;
            `;
            params.push(value);
            params.push(userId);
            params.push(treeId);
            await redisClient.del(key);
          }
        }
        
        console.log('query: ', query);
        console.log('params: ', params);
        if (query.length > 0) {
          result = await connection.query(query, params);
        }

        res.status(200).json(result);
      }, { useRedis: true });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
