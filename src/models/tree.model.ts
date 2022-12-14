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
  RE_RENDER = 'reRender',
  CREATE = 'create',
  EDIT_CONTENT = 'editContent',
  RENAME = 'rename',
  TEMP_READ = 'tempRead'
}

export const InitialTree: Tree = {
  treeId: -1,
  treeType: TreeType.FILE,
  treeName: '',
  treeContent: '',
  treePath: ''
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