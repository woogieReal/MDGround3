export interface Tree {
  treeId: string;
  treeType: number;
  treeName: string;
  treeContent: string;
  treePath: string;
  treeChildren: Tree[];
}

export interface ResGetTrees {
  treeId: string;
  treeType: number;
  treeName: string;
  treePath: string;
  treeChildren: ResGetTrees[];
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}
