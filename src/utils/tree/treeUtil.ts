import {
  Tree,
  TreeType,
  ROOT_TREE_ID,
  INITIAL_TREE_ID,
} from '@/src/models/tree.model';
import _ from 'lodash';
import { checkInitalRootTree, checkFolderTree, checkFileTree } from './treeCheck';

const InitialRootTree: Tree = {
  treeId: ROOT_TREE_ID,
  treeType: TreeType.FORDER,
  treeName: 'ROOT',
  treeContent: '',
  treePath: '',
  treeChildren: [],
}

const InitialTree: Tree = {
  treeId: INITIAL_TREE_ID,
  treeType: TreeType.FILE,
  treeName: '',
  treeContent: '',
  treePath: ''
}

export const createInitialRootTree = _.constant(InitialRootTree);
export const createInitialTree = _.constant(InitialTree);

export const createTreeFullPath = (tree: Tree): string => {
  return checkInitalRootTree(tree) 
    ? ''
    : tree.treePath
      ? tree.treePath + '|' + tree.treeId
      : String(tree.treeId);
};

export const getTreeDepth = (tree: Tree): number => {
  return getTreePathArray(tree.treePath).length;
}


export const getTreePathArray = (treePath: string): number[] => {
  return treePath
    .split('|')
    .map(Number)
    .filter(path => !!path);
}

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

export const sortingTreeByTreeName = (a: Tree, b: Tree) => {
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
