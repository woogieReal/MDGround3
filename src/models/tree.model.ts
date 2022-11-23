export interface Tree {
  treeId: number;
  treeType: TreeType;
  treeName: string;
  treeContent?: string;
  treePath: string;
  treeChildren?: Tree[];
  userId?: string;
  extraInfo?: TreeApiExtraInfo;
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}

export enum TreeApiExtraInfo {
  CREATE = 'create',
  EDIT_CONTENT = 'editContent',
  RENAME = 'rename',
}

export const InitialTree: Tree = {
  treeId: 0,
  treeType: TreeType.FILE,
  treeName: '',
  treeContent: '',
  treePath: ''
}

export const TEST_USER_ID = '92aa8f60-51e2-11ed-bf27-0242ac140002';