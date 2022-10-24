export interface Tree {
  treeId: number;
  treeType: TreeType;
  treeName: string;
  treeContent?: string;
  treePath: string;
  treeChildren?: Tree[];
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}

export const initialFileTree = {
  treeId: 'initial',
  treeType: TreeType.FILE,
  treeName: 'initial file',
  treeContent: 'initial content',
  treePath: '',
}

export const InitialTree: Tree = {
  treeId: 0,
  treeType: TreeType.FILE,
  treeName: 'introduce',
  treeContent: '# Welcome!',
  treePath: ''
}