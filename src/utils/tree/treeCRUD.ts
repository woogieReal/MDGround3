import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { checkInitalRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';

type CUDFromRootTreeFn = (rootTree: Tree, targetTree: Tree) => Tree;
type RFromRootTreeFn = (rootTree: Tree, treeFullPath: string) => Tree;

export const addTreeToTrees: CUDFromRootTreeFn = (rootTree, targetTree) => {
  const parentTree = findTreeByFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = getEmptyArrayIfNotArray(parentTree.treeChildren);
  parentTree.treeChildren.push(targetTree);
  parentTree.treeChildren.sort(sortingTreeByTreeName);
  return replaceTreeFromTrees(rootTree, parentTree);
};


export const findTreeByFullPath: RFromRootTreeFn = (rootTree, treeFullPath) => {
  let cloneRootTree = _.cloneDeep(rootTree);
  let tmpTree: Tree = _.cloneDeep(rootTree);

  getTreePathArray(treeFullPath)
    .forEach((path: number) => {
      tmpTree = checkInitalRootTree(tmpTree)
        ? cloneRootTree.treeChildren?.find((tree) => tree.treeId === path)!
        : tmpTree.treeChildren?.find((tree) => tree.treeId === path)!
    });

  return tmpTree;
};

export const replaceTreeFromTrees: CUDFromRootTreeFn = (rootTree, targetTree) => {
  if (checkInitalRootTree(targetTree)) {
    return _.cloneDeep(targetTree);
  } else {
    let cloneRootTree = _.cloneDeep(rootTree);
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

export const removeTreeFromTrees: CUDFromRootTreeFn = (rootTree, targetTree) => {
  const parentTree = findTreeByFullPath(rootTree, targetTree.treePath);
  parentTree.treeChildren = parentTree.treeChildren?.filter(childTree => childTree.treeId !== targetTree.treeId);
  return replaceTreeFromTrees(rootTree, parentTree);
};
