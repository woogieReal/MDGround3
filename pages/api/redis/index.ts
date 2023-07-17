import RedisConnection from "@/src/apis/redisConnection";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { userId, key },
    body, 
    method 
  } = _req;

  switch (method) {
    case "GET":
      break;
    case "PUT":
      RedisConnection.redisExecutor(async (redisClient) => {
        const { key, value, expireSecond } = body;
        console.log('key: ', key);
        console.log('value: ', value);
        const result = await redisClient.set(key, value, { EX: expireSecond || 1800 });
        const statusCode = result === "OK" ? 200 : 400;
        res.status(statusCode).json(result);
      });
      break;
    case "DELETE":
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
