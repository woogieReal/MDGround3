import {
  Tree,
  TreeStatusInfo,
  TreeType,
  ROOT_TREE_ID,
  INITIAL_TREE_ID,
} from '@/src/models/tree.model';
import { checkEmptyValue } from '@/src/utils/common/commonUtil';

type CheckTreeFn = (targetTree: Tree) => boolean;

export const checkInitalTree: CheckTreeFn = tree => {
  return tree.treeId === INITIAL_TREE_ID;
};

export const checkInitalRootTree: CheckTreeFn = tree => {
  return tree.treeId === ROOT_TREE_ID;
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

export const checkParentIsRootTree: CheckTreeFn = tree => {
  return checkEmptyValue(tree.treePath);
}