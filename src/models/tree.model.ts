export interface Tree {
  treeId: number;
  treeType: number;
  treeName: string;
  treeContent: string;
  treePath: string;
  treeChildren: Tree[];
}

export interface ResTree {
  treeId: number;
  treeType: number;
  treeName: string;
  treeContent: string;
  treePath: string;
  treeChildren: Tree[];
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}
