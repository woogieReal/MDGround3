import type { NextApiRequest, NextApiResponse } from "next";
import { Tree } from "@/src/models/tree.model";
import { mockGetTreeData } from "@/tests/tree/mockData";

// Fake trees data
const eachTree: Tree[] = mockGetTreeData;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body,
    method,
  } = _req;

  switch (method) {
    case "GET":
      res
        .status(200)
        .json(eachTree.find((tree: Tree) => tree.treeId === Number(id)));
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
