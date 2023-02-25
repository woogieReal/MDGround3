import {
  InitialTree,
  InitialRootTree,
  Tree,
  TreeStatusInfo,
  TreeType,
} from '@/src/models/tree.model';
import _, { cloneDeep, map as lodashMap } from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';

type CRUDFromRootTreeFn = (rootTree: Tree, targetTree: Tree) => Tree;
type CheckTreeFn = (targetTree: Tree) => boolean;

export const createInitialRootTree = _.constant(InitialRootTree);
export const createInitialTree = _.constant(InitialTree);

export const checkInitalTree: CheckTreeFn = tree => {
  return tree.treeId === InitialTree.treeId;
};

export const checkInitalRootTree: CheckTreeFn = tree => {
  return tree.treeId === InitialRootTree.treeId;
};

export const checkFolderTree: CheckTreeFn = tree => {
  return tree.treeType === TreeType.FORDER
}

export const checkFileTree: CheckTreeFn = tree => {
  return tree.treeType === TreeType.FILE
}

export const checkEditableTreeNameStatus: CheckTreeFn = tree => {
  return [TreeStatusInfo.CREATE, TreeStatusInfo.RENAME].includes(tree.treeStatus!);
};

export const createTreeFullPath = (tree: Tree): string => {
  return checkInitalRootTree(tree) 
    ? ''
    : tree.treePath
      ? tree.treePath + '|' + tree.treeId
      : String(tree.treeId);
};

const getTreeDepth = (tree: Tree): number => {
  return getTreePathArray(tree.treePath).length;
}

const createDepthToTreesMap = (trees: Tree[]): Map<number, Tree[]> => {
  const depthToTree = new Map<number, Tree[]>();

  const maxDepthTree = _.maxBy(trees, getTreeDepth)
  const maxDepth = getTreeDepth(maxDepthTree!);

  for (let i = 0; i <= maxDepth; i++) {
    const iDepthTrees = _
      .chain(trees)
      .filter((tree) => getTreeDepth(tree) === i)
      .value();

    depthToTree.set(i, iDepthTrees);
  }

  return depthToTree;
}

const makeTreeStructure = (depthToTreesMap: Map<number, Tree[]>): Tree => {
  const treeStructureMap = new Map<number, Tree[]>();
  const maxDepth = _.maxBy(Array.from(depthToTreesMap.keys())) || 0;

  for (let i = 1; i <= maxDepth; i++) {
    const childTrees: Tree[] = depthToTreesMap.get(i) || [];
    const parentTrees: Tree[] = depthToTreesMap.get(i - 1) || [];

    childTrees.forEach((child: Tree) => {
      const parentTreeId = getTreePathArray(child.treePath).pop();
      const parentTree = parentTrees.find((parent) => parent.treeId === parentTreeId);

      if (parentTree) {
        parentTree.treeChildren = getEmptyArrayIfNotArray(parentTree.treeChildren);
        parentTree.treeChildren.push(child);
      }
    });

    treeStructureMap.set(i - 1, parentTrees);    
  }

  return { ...createInitialRootTree(), treeChildren: treeStructureMap.get(0) || [] };
}

const sortingTreeFromRootToLeef = (tree: Tree): Tree => {
  const copyTree = cloneDeep(tree);

  copyTree.treeChildren = getEmptyArrayIfNotArray(copyTree.treeChildren);
  copyTree.treeChildren.sort(sortingTreeByTreeName);

  copyTree.treeChildren.forEach((child, idx, children) => children[idx] = sortingTreeFromRootToLeef(child));

  return copyTree;
}

export const createTreeStructureFromTrees = _.flow([
  createDepthToTreesMap,
  makeTreeStructure,
  sortingTreeFromRootToLeef,
]);

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

export const replaceTree: CRUDFromRootTreeFn = (rootTree, targetTree) => {
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

export const deleteTreeFromTrees: CRUDFromRootTreeFn = (rootTree, targetTree) => {
  const parentTree = findTreeByTreeFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = parentTree.treeChildren?.filter(childTree => childTree.treeId !== targetTree.treeId);
  return replaceTree(rootTree, parentTree);
};

export const addTreeToTrees: CRUDFromRootTreeFn = (rootTree, targetTree) => {
  const parentTree = findTreeByTreeFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = getEmptyArrayIfNotArray(parentTree.treeChildren);
  parentTree.treeChildren.push(targetTree);
  parentTree.treeChildren.sort(sortingTreeByTreeName);
  return replaceTree(rootTree, parentTree);
};

export const getTreeChildrenNames = (targetTrees: Tree[]) : Map<TreeType, string[]> => {
  const folderTreeNames = _
    .chain(targetTrees)
    .filter(checkFolderTree)
    .map('treeName')
    .value();
  
  const fileTreeNames = _
    .chain(targetTrees)
    .filter(checkFileTree)
    .map('treeName')
    .value();

  return new Map<TreeType, string[]>()
    .set(TreeType.FORDER, folderTreeNames)
    .set(TreeType.FILE, fileTreeNames);
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
};
