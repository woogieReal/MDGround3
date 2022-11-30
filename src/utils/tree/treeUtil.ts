import { InitialTree, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
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

export const createTreeStructure = (trees: Tree[]) => {
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

  return depthToTree.get(minDepth);
}

export const deleteTreeFromTrees = (trees: Tree[], targetTree: Tree, isCloneDeep = true) => {
  let cloneTrees = isCloneDeep ? cloneDeep(trees) : trees;

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

export const addTreeToTrees = (trees: Tree[], targetTree: Tree, isCloneDeep = true) => {
  let cloneTrees = isCloneDeep ? cloneDeep(trees) : trees;

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

export const changeTreeFromTrees = (trees: Tree[], targetTree: Tree, isCloneDeep = true) => {
  let cloneTrees = isCloneDeep ? cloneDeep(trees) : trees;

  if (targetTree.treePath.length === 0) {
    const index = cloneTrees.findIndex((tree: Tree) => tree.treeId === targetTree.treeId);

    if (index >= 0) {
      cloneTrees[index] = targetTree;
      cloneTrees.sort(sortingTreeByTreeName)
    }
  } else {
    const upperTreeIds = targetTree.treePath.split("|");
    let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneTrees };

    upperTreeIds.forEach((id: string) => {
      targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    })

    targetUpperTree.treeChildren = getEmptyArrayIfNotArray(targetUpperTree.treeChildren);
    const index = targetUpperTree.treeChildren.findIndex((tree: Tree) => tree.treeId === targetTree.treeId);
    targetUpperTree.treeChildren[index] = targetTree;
    targetUpperTree.treeChildren.sort(sortingTreeByTreeName);
  }

  return cloneTrees;
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

export const checkEditableTreeNameStatus = (tree: Tree): boolean => {
  return [TreeStatusInfo.CREATE, TreeStatusInfo.RENAME].includes(tree.treeStatus!)
}

export const changeStatusReRenderFromRootToNode = (trees: Tree[], targetTree: Tree, isCloneDeep = true) => {
  let cloneTrees = isCloneDeep ? cloneDeep(trees) : trees;

  const treeFullPath = createTreeFullPath(targetTree).split('|');
  let targetUpperTree: Tree = { ...InitialTree, treeChildren: cloneTrees };

  treeFullPath.forEach((id: string) => {
    targetUpperTree = targetUpperTree?.treeChildren?.find((upperTree: Tree) => upperTree.treeId === Number(id))!;
    targetUpperTree.treeStatus = TreeStatusInfo.RE_RENDER
  })

  return cloneTrees;
}