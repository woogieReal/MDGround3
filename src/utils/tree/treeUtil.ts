import {
  InitialTree,
  InitialRootTree,
  Tree,
  TreeStatusInfo,
  TreeType,
} from '@/src/models/tree.model';
import { cloneDeep } from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';

export const checkInitalTree = (tree: Tree): boolean => {
  return tree.treeId === InitialTree.treeId;
};

export const checkInitalRootTree = (tree: Tree): boolean => {
  return tree.treeId === InitialRootTree.treeId;
};

export const createTreeFullPath = (tree: Tree): string => {
  return checkInitalRootTree(tree) 
    ? ''
    : tree.treePath
      ? tree.treePath + '|' + tree.treeId
      : String(tree.treeId);
};

export const createTreeStructure = (trees: Tree[]): Tree => {
  const cloneTrees = cloneDeep(trees);
  const rootTree = InitialRootTree;
  const depthToTree = new Map();

  while (cloneTrees.length > 0) {
    const tree: Tree = cloneTrees.pop()!;
    const treeDepth = !!tree!.treePath ? tree!.treePath.split('|').length : 0;
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
      const parentTreeId = Number(child.treePath.split('|').pop());
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
};

const getTreePathArray = (treePath: string): number[] => {
  return treePath
    .split('|')
    .map(Number)
    .filter(path => !!path);
}

const findTreeByTreeFullPath = (rootTree: Tree, treeFullPath: string): Tree => {
  let cloneRootTree = cloneDeep(rootTree);
  let tmpTree: Tree = cloneDeep(rootTree);

  getTreePathArray(treeFullPath)
    .forEach((path: number) => {
      tmpTree = checkInitalRootTree(tmpTree)
        ? cloneRootTree.treeChildren?.find((tree) => tree.treeId === path)!
        : tmpTree.treeChildren?.find((tree) => tree.treeId === path)!
    });

  return tmpTree;
};

export const replaceTree = (rootTree: Tree, targetTree: Tree): Tree => {
  if (checkInitalRootTree(targetTree)) {
    return cloneDeep(targetTree);
  } else {
    let cloneRootTree = cloneDeep(rootTree);
    let tmpTree: Tree = cloneRootTree;
  
    getTreePathArray(createTreeFullPath(targetTree))
      .forEach((path: number, idx: number, paths: number[]) => {
        if (paths.length -1 !== idx) {
          tmpTree = checkInitalRootTree(tmpTree)
            ? cloneRootTree.treeChildren?.find((tree) => tree.treeId === path)!
            : tmpTree.treeChildren?.find((tree) => tree.treeId === path)!
        } else {
          const index = tmpTree.treeChildren?.findIndex(tree => tree.treeId === path);
          tmpTree.treeChildren![index!] = targetTree;
        }
      });
    
    return cloneRootTree;
  }
}

export const deleteTreeFromTrees = (rootTree: Tree, targetTree: Tree): Tree => {
  const parentTree = findTreeByTreeFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = parentTree.treeChildren?.filter(childTree => childTree.treeId !== targetTree.treeId);
  return replaceTree(rootTree, parentTree);
};

export const addTreeToTrees = (rootTree: Tree, targetTree: Tree): Tree => {
  const parentTree = findTreeByTreeFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = getEmptyArrayIfNotArray(parentTree.treeChildren);
  parentTree.treeChildren.push(targetTree);
  parentTree.treeChildren.sort(sortingTreeByTreeName);
  return replaceTree(rootTree, parentTree);
};

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
};

export const checkEditableTreeNameStatus = (tree: Tree): boolean => {
  return [TreeStatusInfo.CREATE, TreeStatusInfo.RENAME].includes(tree.treeStatus!);
};

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
};
