import { InitialTree, RootTree, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import { cloneDeep } from "lodash";
import { getEmptyArrayIfNotArray } from "../common/arrayUtil";

export const checkInitalTree = (tree: Tree): boolean => {
  return tree.treeId === InitialTree.treeId;
}

export const createTreeFullPath = (tree?: Tree): string => {
  if (tree) {
    return tree.treePath
      ? tree.treePath + "|" + tree.treeId
      : String(tree.treeId);
  } else {
    return "";
  }
};

export const createTreeStructure = (trees: Tree[]): Tree => {
  const rootTree = RootTree;
  const depthToTree = new Map();

  while (trees.length > 0) {
    const tree: Tree = trees.pop()!;
    const treeDepth = !!tree!.treePath
      ? tree!.treePath.split("|").length
      : 0;
    const depthTrees: Tree[] = depthToTree.get(treeDepth) || [];
    depthTrees.push(tree);
    depthToTree.set(treeDepth, depthTrees);
  }

  let depths: number[] = Array.from(depthToTree.keys());
  let maxDepth = Math.max(...depths);
  let minDepth = Math.min(...depths);

  while (maxDepth > minDepth) {
    const childTrees: Tree[] = depthToTree.get(maxDepth);
    const parentTrees: Tree[] = depthToTree.get(maxDepth - 1);

    childTrees.forEach((child: Tree) => {
      const parentTreeId = Number(child.treePath.split("|").pop());
      const parentTreeIndex = parentTrees.findIndex(
        (parent) => parent.treeId === parentTreeId
      );
      parentTrees[parentTreeIndex].treeChildren
        ? parentTrees[parentTreeIndex].treeChildren!.push(child)
        : (parentTrees[parentTreeIndex].treeChildren = [child]);
    });

    depthToTree.set(maxDepth - 1, parentTrees);
    maxDepth -= 1;
  }

  rootTree.treeChildren = depthToTree.get(minDepth);
  return rootTree;
}

export const deleteTreeFromTrees = (rootTree: Tree, targetTree: Tree): Tree => {
  let cloneRootTree = cloneDeep(rootTree);

  const upperTreeIds = targetTree.treePath.split("|");
  let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneRootTree.treeChildren };

  upperTreeIds.forEach((id: string) => {
    targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
  })

  targetUpperTree.treeChildren = targetUpperTree.treeChildren?.filter((child: Tree) => child.treeId !== targetTree.treeId);

  return cloneRootTree;
}

export const addTreeToTrees = (rootTree: Tree, targetTree: Tree): Tree => {
  let cloneRootTree = cloneDeep(rootTree);

  const upperTreeIds = targetTree.treePath.split("|");
  let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneRootTree.treeChildren };

  upperTreeIds.forEach((id: string) => {
    targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
  })

  targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
  targetUpperTree.treeChildren.push(targetTree);
  targetUpperTree.treeChildren.sort(sortingTreeByTreeName);
  
  return cloneRootTree;
}

export const changeTreeFromTrees = (rootTree: Tree, targetTree: Tree): Tree => {
  let cloneRootTree = cloneDeep(rootTree);

  const upperTreeIds = targetTree.treePath.split("|");
  let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneRootTree.treeChildren };

  upperTreeIds.forEach((id: string) => {
    targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
  })

  targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
  const index = targetUpperTree.treeChildren.findIndex((tree: Tree) => tree.treeId === targetTree.treeId);

  if (index >= 0) {
    targetUpperTree.treeChildren[index] = targetTree;
    targetUpperTree.treeChildren.sort(sortingTreeByTreeName);
  }

  return cloneRootTree;
}

export const getTreeChildrenNames = (trees: Tree | Tree[]): Map<TreeType, string[]> => {
  let targetUpperTree: Tree;

  if (Array.isArray(trees)) {
    targetUpperTree = { ...InitialTree, treeChildren: trees as Tree[] };
  } else {
    targetUpperTree = trees as Tree;
  }

  targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);

  const folderTrees = targetUpperTree.treeChildren.filter((treeChild: Tree) => treeChild.treeType === TreeType.FORDER);
  const fileTrees = targetUpperTree.treeChildren.filter((treeChild: Tree) => treeChild.treeType === TreeType.FILE);

  return new Map<TreeType, string[]>()
    .set(TreeType.FORDER, folderTrees.map((treeChild: Tree) => treeChild.treeName))
    .set(TreeType.FILE, fileTrees.map((treeChild: Tree) => treeChild.treeName))
  ;
}

export const checkEditableTreeNameStatus = (tree: Tree): boolean => {
  return [TreeStatusInfo.CREATE, TreeStatusInfo.RENAME].includes(tree.treeStatus!)
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
