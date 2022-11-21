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
  let cloneTrees = cloneDeep(trees);

  if (targetTree.treePath.length === 0) {
    cloneTrees = cloneTrees.filter((child: Tree) => child.treeId !== targetTree.treeId);
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneTrees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = targetUpperTree.treeChildren?.filter((child: Tree) => child.treeId !== targetTree.treeId);
  }

  return cloneTrees;
}

export const addTreeToTrees = (trees: Tree[], targetTree: Tree) => {
  let cloneTrees = cloneDeep(trees);

  if (targetTree.treePath.length === 0) {
    cloneTrees = getEmptyArrayIfNotArray(cloneTrees);
    cloneTrees.push(targetTree);
    cloneTrees.sort(sortingTreeByTreeName)
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneTrees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
    targetUpperTree.treeChildren.push(targetTree);
    targetUpperTree.treeChildren.sort(sortingTreeByTreeName);
  }
  
  return cloneTrees;
}

export const getTreeChildrenNames = (trees: Tree | Tree[], treeType?: TreeType): string[] => {
  let cloneTrees = cloneDeep(trees);

  let targetUpperTree: Tree;

  if (Array.isArray(cloneTrees)) {
    targetUpperTree = { ...InitialTree, treeChildren: cloneTrees as Tree[] };
  } else {
    targetUpperTree = cloneTrees as Tree;
  }

  targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
  if (treeType) {
    targetUpperTree.treeChildren = targetUpperTree.treeChildren.filter((treeChild: Tree) => treeChild.treeType === treeType);
  }

  return targetUpperTree.treeChildren.map((treeChild: Tree) => treeChild.treeName);
}

const sortingTreeByTreeName = (a: Tree, b: Tree) => {
  if (a.treeType < b.treeType) {
    return -1;
  } else if (a.treeType > b.treeType) {
    return 1;
  } else {
    const nameA = a.treeName;
    const nameB = b.treeName;

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }
}