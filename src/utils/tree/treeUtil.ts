import { Tree } from "@/src/models/tree.model";

export const createTreeFullPath = (tree: Tree): string => {
  return tree.treePath ? tree.treePath + '|' + tree.treeId : String(tree.treeId);
}