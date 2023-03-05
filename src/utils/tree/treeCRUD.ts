import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { checkSameTreeDepth } from './treeCheck';
import { getTreePathArray } from './treeUtil';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as B from 'fp-ts/boolean'
import { pipe } from 'fp-ts/function'
import { addChildToParentCR, findChildFromParentById, removeChildFromParentCR, replaceChildFromParent } from './treeChildCRUD';

type CUDFromRootFn = (upperTree: Tree, lowerTree: Tree) => Tree;
type RFromRootFn = (upperTree: Readonly<Tree>, fullPathArray: number[]) => Tree | undefined;

export const addTreeToUpper: CUDFromRootFn = (upperTree, lowerTree) => pipe(
  O.fromNullableK(findTreeFromUpper)(upperTree, getTreePathArray(lowerTree.treePath)),
  E.fromOption(() => upperTree),
  E.toUnion,
  addChildToParentCR(lowerTree),
  replaceTreeFromUpperCL(upperTree),
);

export const findTreeFromUpper: RFromRootFn = (upperTree, fullPathArray) => pipe(
  O.fromNullable(fullPathArray.shift()),
  O.match(
    () => upperTree,
    (treeId) => pipe(
      O.fromNullableK(findChildFromParentById)(upperTree, treeId),
      O.match(
        () => undefined,
        (child) => findTreeFromUpper(child, fullPathArray)
      )
    ),
  )
);

export const replaceTreeFromUpper: CUDFromRootFn = (upperTree, lowerTree) => pipe(
  !checkSameTreeDepth(upperTree, lowerTree),
  B.match(
    () => _.cloneDeep(lowerTree),
    () => pipe(
      O.fromNullableK(findTreeFromUpper)(upperTree, getTreePathArray(lowerTree.treePath)),
      O.match(
        () => _.cloneDeep(upperTree),
        (parentTree) => pipe(
          replaceChildFromParent(parentTree, lowerTree),
          replaceTreeFromUpperCL(upperTree),
        )
      )
    ),
  ),
);

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