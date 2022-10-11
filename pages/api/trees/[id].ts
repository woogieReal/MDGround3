import type { NextApiRequest, NextApiResponse } from "next";
import { ResGetTrees } from "@/src/models/tree.model";
import mockData from "@/tests/tree/mockData";

// Fake trees data
const trees: ResGetTrees[] = mockData;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body,
    method,
  } = _req;

  switch (method) {
    case "GET":
      res.status(200).json(trees.find((tree: ResGetTrees) => tree.treeId === id));
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
