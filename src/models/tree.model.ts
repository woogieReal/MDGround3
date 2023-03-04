export interface Tree {
  treeId: number;
  treeType: TreeType;
  treeName: string;
  treeContent?: string;
  treePath: string;
  treeChildren?: Tree[];
  userId?: string;
  treeStatus?: TreeStatusInfo;
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}

export enum TreeStatusInfo {
  DEFAULT = 'default',
  CREATE = 'create',
  EDIT_CONTENT = 'editContent',
  RENAME = 'rename',
  TEMP_READ = 'tempRead'
}

export enum MethodTypeForRecursivTreeItem {
  DEFAULT = 'default',
  OPEN_CONTEXT = 'openContext',
  CREATE = 'create',
  RENAME = 'rename',
  CLICK = 'click',
  DOUBLE_CLICK = 'doubleClick',
  DELETE_TAB = 'deleteTab',
}

export const TEST_USER_ID = '92aa8f60-51e2-11ed-bf27-0242ac140002';

export const ROOT_TREE_ID = 0;
export const INITIAL_TREE_ID = -1;