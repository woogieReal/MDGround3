import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { checkInitalRootTree } from './treeCheck';
import { createTreeFullPath, getTreePathArray, sortingTreeByTreeName } from './treeUtil';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { addChildToParentCR, findChildFromParentById, removeChildFromParentCR } from './treeChildCRUD';

type CUDFromRootFn = (rootTree: Tree, targetTree: Tree) => Tree;
type RFromRootFn = (rootTree: Readonly<Tree>, fullPathArray: number[]) => Tree | undefined;

export const addTreeToRoot: CUDFromRootFn = (rootTree, targetTree) => pipe(
  O.fromNullableK(findTreeFromRoot)(rootTree, getTreePathArray(targetTree.treePath)),
  E.fromOption(() => rootTree),
  E.toUnion,
  addChildToParentCR(targetTree),
  replaceTreeFromTreesCL(rootTree),
);

export const findTreeFromRoot: RFromRootFn = (parentTree, fullPathArray) => {
  const treeId = fullPathArray.shift();
  if (treeId) {
    const childTree = findChildFromParentById(parentTree, treeId);

    if (childTree) {
      return findTreeFromRoot(childTree, fullPathArray);
    } else {
      return undefined;
    }
    
  } else {
    return parentTree;
  }
}

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
  O.fromNullableK(findTreeFromRoot)(rootTree, getTreePathArray(targetTree.treePath)),
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