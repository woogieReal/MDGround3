import { InitialTree, Tree } from "@/src/models/tree.model";
import { cloneDeep } from "lodash";
import { getEmptyArrayIfNotArray } from "../common/arrayUtil";

export const createTreeFullPath = (tree?: Tree): string => {
  if (tree) {
    return tree.treePath
      ? tree.treePath + "|" + tree.treeId
      : String(tree.treeId);
  } else {
    return "";
  }
};

export const deleteTreeFromTrees = (trees: Tree[], targetTree: Tree) => {
  if (targetTree.treePath.length === 0) {
    trees = trees.filter((child: Tree) => child.treeId !== targetTree.treeId);
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: trees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = targetUpperTree.treeChildren?.filter((child: Tree) => child.treeId !== targetTree.treeId);
  }

  return cloneDeep(trees);
}

export const addTreeToTrees = (trees: Tree[], targetTree: Tree) => {
  if (targetTree.treePath.length === 0) {
    trees = getEmptyArrayIfNotArray(trees);
    trees.push(targetTree);
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: trees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
    targetUpperTree.treeChildren.push(targetTree);
  }
  
  return cloneDeep(trees);
}