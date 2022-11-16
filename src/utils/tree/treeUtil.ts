import { InitialTree, Tree, TreeType } from "@/src/models/tree.model";
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
  let newTrees = cloneDeep(trees);

  if (targetTree.treePath.length === 0) {
    newTrees = getEmptyArrayIfNotArray(newTrees);
    newTrees.push(targetTree);
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: newTrees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
    targetUpperTree.treeChildren.push(targetTree);
  }
  
  return newTrees;
}

export const getTreeChildrenNames = (targetTree: Tree | Tree[], treeType?: TreeType): string[] => {
  let targetUpperTree: Tree;

  if (Array.isArray(targetTree)) {
    targetUpperTree = { ...InitialTree, treeChildren: targetTree as Tree[] };
  } else {
    targetUpperTree = targetTree as Tree;
  }

  targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
  if (treeType) {
    targetUpperTree.treeChildren = targetUpperTree.treeChildren.filter((treeChild: Tree) => treeChild.treeType === treeType);
  }

  return targetUpperTree.treeChildren.map((treeChild: Tree) => treeChild.treeName);
}