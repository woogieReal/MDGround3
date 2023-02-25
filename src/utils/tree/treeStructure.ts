import { Tree } from '@/src/models/tree.model';
import _ from 'lodash';
import { getEmptyArrayIfNotArray } from '../common/arrayUtil';
import { getTreeDepth, getTreePathArray, createInitialRootTree, sortingTreeByTreeName } from './treeUtil';

const createDepthToTreesMap = (trees: Tree[]): Map<number, Tree[]> => {
  const depthToTree = new Map<number, Tree[]>();

  const maxDepthTree = _.maxBy(trees, getTreeDepth)
  const maxDepth = getTreeDepth(maxDepthTree!);

  for (let i = 0; i <= maxDepth; i++) {
    const iDepthTrees = _
      .chain(trees)
      .filter((tree) => getTreeDepth(tree) === i)
      .value();

    depthToTree.set(i, iDepthTrees);
  }

  return depthToTree;
}

const makeTreeStructure = (depthToTreesMap: Map<number, Tree[]>): Tree => {
  const treeStructureMap = new Map<number, Tree[]>();
  const maxDepth = _.maxBy(Array.from(depthToTreesMap.keys())) || 0;

  for (let i = 1; i <= maxDepth; i++) {
    const childTrees: Tree[] = depthToTreesMap.get(i) || [];
    const parentTrees: Tree[] = depthToTreesMap.get(i - 1) || [];

    childTrees.forEach((child: Tree) => {
      const parentTreeId = getTreePathArray(child.treePath).pop();
      const parentTree = parentTrees.find((parent) => parent.treeId === parentTreeId);

      if (parentTree) {
        parentTree.treeChildren = getEmptyArrayIfNotArray(parentTree.treeChildren);
        parentTree.treeChildren.push(child);
      }
    });

    treeStructureMap.set(i - 1, parentTrees);    
  }

  return { ...createInitialRootTree(), treeChildren: treeStructureMap.get(0) || [] };
}

const sortingTreeFromRootToLeef = (tree: Tree): Tree => {
  const copyTree = _.cloneDeep(tree);

  copyTree.treeChildren = getEmptyArrayIfNotArray(copyTree.treeChildren);
  copyTree.treeChildren.sort(sortingTreeByTreeName);

  copyTree.treeChildren.forEach((child, idx, children) => children[idx] = sortingTreeFromRootToLeef(child));

  return copyTree;
}

export const createTreeStructureFromTrees = _.flow([
  createDepthToTreesMap,
  makeTreeStructure,
  sortingTreeFromRootToLeef,
]);
