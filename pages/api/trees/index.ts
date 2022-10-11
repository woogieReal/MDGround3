import type { NextApiRequest, NextApiResponse } from "next";
import { ResTrees } from "@/src/models/tree.model";
import mockData from "@/tests/tree/mockData";

// Fake trees data
const trees: ResTrees[] = mockData;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    method,
  } = _req;

  switch (method) {
    case "GET":
      res.status(200).json(trees);
      break;
    case "POST":
      res.status(200).json(body);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
