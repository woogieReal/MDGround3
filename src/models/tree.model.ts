export interface Tree {
  treeId: string;
  treeType: number;
  treeName: string;
  treeContent: string;
  treePath: string;
  treeChildren: Tree[];
}

export interface ResTrees {
  treeId: string;
  treeType: number;
  treeName: string;
  treePath: string;
  treeChildren: ResTrees[];
}

export enum TreeType {
  FORDER = 10,
  FILE = 20,
}
