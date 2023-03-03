import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { checkInitalRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

type CUDFromRootTreeFn = (rootTree: Tree, targetTree: Tree) => Tree;
type RFromRootTreeFn = (rootTree: Tree, treeFullPath: string) => Tree;

const addChildToTree = (childTree: Tree) => (parentTree: Tree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = getEmptyArrayIfNotArray(copyParentTree.treeChildren);
  copyParentTree.treeChildren.push(childTree);
  copyParentTree.treeChildren.sort(sortingTreeByTreeName);

  return copyParentTree;
}

const removeChildFromTree = (childTree: Tree) => (parentTree: Tree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = copyParentTree.treeChildren?.filter(child => child.treeId !== childTree.treeId);

  return copyParentTree;
}

export const addTreeToTrees: CUDFromRootTreeFn = (rootTree, targetTree) => pipe(
  findTreeByFullPath(rootTree, targetTree.treePath),
  addChildToTree(targetTree),
  curriedReplaceTreeFromTrees(rootTree),
);

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

export const removeTreeFromTrees: CUDFromRootTreeFn = (rootTree, targetTree) => pipe(
  findTreeByFullPath(rootTree, targetTree.treePath),
  removeChildFromTree(targetTree),
  curriedReplaceTreeFromTrees(rootTree),
);

const curriedReplaceTreeFromTrees = _.curry(replaceTreeFromTrees);