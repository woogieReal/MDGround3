import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { checkInitalRootTree, checkSameTreeDepth } from './treeCheck';
import { createTreeFullPath, getTreeDepth, getTreePathArray } from './treeUtil';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { addChildToParentCR, findChildFromParentById, removeChildFromParentCR } from './treeChildCRUD';

type CUDFromRootFn = (upperTree: Tree, lowerTree: Tree) => Tree;
type RFromRootFn = (upperTree: Readonly<Tree>, fullPathArray: number[]) => Tree | undefined;

export const addTreeToUpper: CUDFromRootFn = (upperTree, lowerTree) => pipe(
  O.fromNullableK(findTreeFromUpper)(upperTree, getTreePathArray(lowerTree.treePath)),
  E.fromOption(() => upperTree),
  E.toUnion,
  addChildToParentCR(lowerTree),
  replaceTreeFromUpperCL(upperTree),
);

export const findTreeFromUpper: RFromRootFn = (upperTree, fullPathArray) => {
  const treeId = fullPathArray.shift();
  if (treeId) {
    const childTree = findChildFromParentById(upperTree, treeId);

    if (childTree) {
      return findTreeFromUpper(childTree, fullPathArray);
    } else {
      return undefined;
    }
    
  } else {
    return upperTree;
  }
}

export const replaceTreeFromUpper: CUDFromRootFn = (upperTree, lowerTree) => {
  if (checkSameTreeDepth(upperTree, lowerTree)) {
    return _.cloneDeep(lowerTree);
  } else {
    let cloneUpperTree = _.cloneDeep(upperTree);
    let tmpTree: Tree = cloneUpperTree;
  
    getTreePathArray(createTreeFullPath(lowerTree))
      .forEach((path: number, idx: number, paths: number[]) => {
        if (paths.length -1 !== idx) {
          tmpTree = checkInitalRootTree(tmpTree)
            ? cloneUpperTree.treeChildren?.find((tree) => tree.treeId === path)!
            : tmpTree.treeChildren?.find((tree) => tree.treeId === path)!
        } else {
          const index = tmpTree.treeChildren?.findIndex(tree => tree.treeId === path);
          tmpTree.treeChildren![index!] = lowerTree;
        }
      });
    
    return cloneUpperTree;
  }
}

export const removeTreeFromUpper: CUDFromRootFn = (upperTree, lowerTree) => pipe(
  O.fromNullableK(findTreeFromUpper)(upperTree, getTreePathArray(lowerTree.treePath)),
  O.match(
    () => upperTree,
    (parentTree) => pipe(
      parentTree,
      removeChildFromParentCR(lowerTree),
      replaceTreeFromUpperCL(upperTree),
    )
  )
);

const replaceTreeFromUpperCL = _.curry(replaceTreeFromUpper);