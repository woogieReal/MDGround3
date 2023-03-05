import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { checkInitalRootTree, checkParentIsRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { addChildToParentCR, removeChildFromParentCR } from './treeChildCRUD';

type CUDFromRootFn = (rootTree: Tree, targetTree: Tree) => Tree;

export const addTreeToRoot: CUDFromRootFn = (rootTree, targetTree) => pipe(
  O.fromNullableK(findParentTreeFromRoot)(rootTree, targetTree),
  E.fromOption(() => rootTree),
  E.toUnion,
  addChildToParentCR(targetTree),
  replaceTreeFromTreesCL(rootTree),
);

export const findParentTreeFromRoot = (rootTree: Tree, targetTree: Tree): Tree | undefined => {
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

export const replaceTreeFromRoot: CUDFromRootFn = (rootTree, targetTree) => {
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

export const removeTreeFromRoot: CUDFromRootFn = (rootTree, targetTree) => pipe(
  O.fromNullableK(findParentTreeFromRoot)(rootTree, targetTree),
  O.match(
    () => rootTree,
    (parentTree) => pipe(
      parentTree,
      removeChildFromParentCR(targetTree),
      replaceTreeFromTreesCL(rootTree),
    )
  )
);

const replaceTreeFromTreesCL = _.curry(replaceTreeFromRoot);