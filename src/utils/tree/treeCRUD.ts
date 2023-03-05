import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { checkInitalRootTree, checkParentIsRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

type CUDFromRootTreeFn = (rootTree: Tree, targetTree: Tree) => Tree;
type CUDFromParentTreeFn = (parentTree: Tree, childTree: Tree) => Tree;

const addChildToTree: CUDFromParentTreeFn = (parentTree, childTree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = getEmptyArrayIfNotArray(copyParentTree.treeChildren);
  copyParentTree.treeChildren.push(childTree);
  copyParentTree.treeChildren.sort(sortingTreeByTreeName);

  return copyParentTree;
}

const removeChildFromTree: CUDFromParentTreeFn = (parentTree, childTree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = copyParentTree.treeChildren?.filter(child => child.treeId !== childTree.treeId);

  return copyParentTree;
}

export const addTreeToRootTree: CUDFromRootTreeFn = (rootTree, targetTree) => pipe(
  O.fromNullableK(findParentTreeFromRootTree)(rootTree, targetTree),
  E.fromOption(() => rootTree),
  E.toUnion,
  addChildToTreeCR(targetTree),
  replaceTreeFromTreesCL(rootTree),
);

export const findParentTreeFromRootTree = (rootTree: Tree, targetTree: Tree): Tree | undefined => {
  let tmpTree: Tree | undefined = undefined;

  if (checkParentIsRootTree(targetTree)) {
    return rootTree;
  } else {
    getTreePathArray(targetTree.treePath)
      .forEach((path: number) => {
        tmpTree = tmpTree
          ? tmpTree.treeChildren?.find((tree) => tree.treeId === path)
          : rootTree.treeChildren?.find((tree) => tree.treeId === path)
      });
  
    return tmpTree;
  }
};

export const replaceTreeFromRootTree: CUDFromRootTreeFn = (rootTree, targetTree) => {
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

export const removeTreeFromRootTree: CUDFromRootTreeFn = (rootTree, targetTree) => pipe(
  O.fromNullableK(findParentTreeFromRootTree)(rootTree, targetTree),
  O.match(
    () => rootTree,
    (parentTree) => pipe(
      parentTree,
      removeChildFromTreeCR(targetTree),
      replaceTreeFromTreesCL(rootTree),
    )
  )
);

const replaceTreeFromTreesCL = _.curry(replaceTreeFromRootTree);
const addChildToTreeCR = _.curryRight(addChildToTree);
const removeChildFromTreeCR = _.curryRight(removeChildFromTree);