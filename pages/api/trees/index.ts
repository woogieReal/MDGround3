import type { NextApiRequest, NextApiResponse } from "next";
import { Tree } from "@/src/models/tree.model";
import { mockGetTreesData } from "@/tests/tree/mockData";

// Fake trees data
const trees: Tree[] = mockGetTreesData;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = _req;

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
