import {
  InitialTree,
  InitialRootTree,
  Tree,
  TreeStatusInfo,
  TreeType,
} from '@/src/models/tree.model';

type CheckTreeFn = (targetTree: Tree) => boolean;

export const checkInitalTree: CheckTreeFn = tree => {
  return tree.treeId === InitialTree.treeId;
};

export const checkInitalRootTree: CheckTreeFn = tree => {
  return tree.treeId === InitialRootTree.treeId;
};

export const checkFolderTree: CheckTreeFn = tree => {
  return tree.treeType === TreeType.FORDER
}

export const checkFileTree: CheckTreeFn = tree => {
  return tree.treeType === TreeType.FILE
}

export const checkEditableTreeNameStatus: CheckTreeFn = tree => {
  return [TreeStatusInfo.CREATE, TreeStatusInfo.RENAME].includes(tree.treeStatus!);
};