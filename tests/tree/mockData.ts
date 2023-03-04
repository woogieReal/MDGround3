import { Tree } from "@/src/models/tree.model";

export const MOCK_TREE_DATA: Tree = {
  treeId: 0,
  treeType: 10,
  treeName: "ROOT",
  treeContent: "",
  treePath: "",
  treeChildren: [
    {
      treeId: 1,
      treeType: 10,
      treeName: "Mine",
      treePath: "",
      treeChildren: [
        {
          treeId: 2,
          treeType: 20,
          treeName: "메모",
          treePath: "1",
          treeChildren: [],
        },
      ],
    },
    {
      treeId: 6,
      treeType: 10,
      treeName: "기술",
      treePath: "",
      treeChildren: [
        {
          treeId: 7,
          treeType: 10,
          treeName: "javascript",
          treePath: "6",
          treeChildren: [
            {
              treeId: 9,
              treeType: 20,
              treeName: "Object",
              treePath: "6|7",
              treeChildren: [],
            },
            {
              treeId: 10,
              treeType: 20,
              treeName: "window.onload",
              treePath: "6|7",
              treeChildren: [],
            },
          ],
        },
        {
          treeId: 8,
          treeType: 10,
          treeName: "파이썬",
          treePath: "6",
          treeChildren: [
            {
              treeId: 11,
              treeType: 20,
              treeName: "파이썬이란",
              treePath: "6|8",
              treeChildren: [],
            },
          ],
        },
      ],
    },
    {
      treeId: 4,
      treeType: 20,
      treeName: "vscode 단축기",
      treePath: "",
      treeChildren: [],
    },
    {
      treeId: 5,
      treeType: 20,
      treeName: "단축기",
      treePath: "",
      treeChildren: [],
    },
  ],
};

export const NEW_TREE: Tree = {
  treeId: Math.floor(Math.random() * 101) + 100,
  treeType: 20,
  treeName: "new file",
  treePath: ""
};

export const DEPTH_1_TREE: Tree = {
  treeId: 4,
  treeType: 20,
  treeName: "vscode 단축기",
  treePath: "",
  treeChildren: [],
};

export const DEPTH_3_TREE: Tree = {
  treeId: 10,
  treeType: 20,
  treeName: "window.onload",
  treePath: "6|7",
  treeChildren: [],
};

