import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { checkInitalRootTree, checkParentIsRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';
import * as O from 'fp-ts/Option'
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

export const addTreeToTrees: CUDFromRootTreeFn = (rootTree, targetTree) => pipe(
  targetTree,
  curryFindParentTreeFromTrees(rootTree),
  O.match(
    () => rootTree,
    (parentTree) => pipe(
      parentTree,
      curryRightAddChildToTree(targetTree),
      curryReplaceTreeFromTrees(rootTree),
    )
  )
);

export const findParentTreeFromTrees = (rootTree: Tree, targetTree: Tree): O.Option<Tree> => {
  let tmpTree: Tree | undefined = undefined;

  if (checkParentIsRootTree(targetTree)) {
    return O.some(rootTree);
  } else {
    getTreePathArray(targetTree.treePath)
      .forEach((path: number) => {
        tmpTree = tmpTree
          ? tmpTree.treeChildren?.find((tree) => tree.treeId === path)
          : rootTree.treeChildren?.find((tree) => tree.treeId === path)
      });
  
    return tmpTree ? O.some(tmpTree) : O.none;
  }
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
  targetTree,
  curryFindParentTreeFromTrees(rootTree),
  O.match(
    () => rootTree,
    (parentTree) => pipe(
      parentTree,
      curryRightRemoveChildFromTree(targetTree),
      curryReplaceTreeFromTrees(rootTree),
    )
  )
);

const curryReplaceTreeFromTrees = _.curry(replaceTreeFromTrees);
const curryFindParentTreeFromTrees = _.curry(findParentTreeFromTrees);
const curryRightAddChildToTree = _.curryRight(addChildToTree);
const curryRightRemoveChildFromTree = _.curryRight(removeChildFromTree);