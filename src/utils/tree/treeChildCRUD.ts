import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { sortingTreeByTreeName } from './treeUtil';

type CUDFromParentFn = (parentTree: Tree, childTree: Tree) => Tree;

export const addChildToParent: CUDFromParentFn = (parentTree, childTree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = getEmptyArrayIfNotArray(copyParentTree.treeChildren);
  copyParentTree.treeChildren.push(childTree);
  copyParentTree.treeChildren.sort(sortingTreeByTreeName);

  return copyParentTree;
}

export const findChildFromParentById = (
  parentTree: Readonly<Tree>,
  childTreeId: number
): Tree | undefined => _.find(parentTree.treeChildren, { 'treeId': childTreeId });

export const removeChildFromParent: CUDFromParentFn = (parentTree, childTree) => {
  const copyParentTree = _.cloneDeep(parentTree);
  
  copyParentTree.treeChildren = copyParentTree.treeChildren?.filter(child => child.treeId !== childTree.treeId);

  return copyParentTree;
}

export const addChildToParentCR = _.curryRight(addChildToParent);
export const removeChildFromParentCR = _.curryRight(removeChildFromParent);