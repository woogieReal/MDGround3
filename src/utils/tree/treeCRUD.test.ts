import { describe, expect, test } from "@jest/globals";
import { addTreeToTrees, findTreeByFullPath, removeTreeFromTrees } from "@/src/utils/tree/treeCRUD";
import { DEPTH_1_TREE, DEPTH_3_TREE, MOCK_TREE_DATA, NEW_TREE } from "@/tests/tree/mockData";
import { ROOT_TREE_ID, Tree, TreeType } from "@/src/models/tree.model";
import { cloneDeep } from "lodash";

describe("treeCRUD", () => {
  describe("findTreeByFullPath", () => {
    test("treeFullPath가 빈 문자열 일 때", () => {
      const res = findTreeByFullPath(MOCK_TREE_DATA, "");
      expect(res.treeId).toBe(ROOT_TREE_ID);
    });
  
    test("treeFullPath가 파이프라인이 없을 때 (1 depth)", () => {
      const res = findTreeByFullPath(MOCK_TREE_DATA, "4");
      expect(res.treeId).toBe(4);
    });
  
    test("treeFullPath가 파이프라인이 있을 때 (n depth)", () => {
      const res = findTreeByFullPath(MOCK_TREE_DATA, "6|7|10");
      expect(res.treeId).toBe(10);
    });
  });

  describe("addTreeToTrees", () => {
    test("1 depth 추가", () => {
      const targetTree = cloneDeep(NEW_TREE);
      targetTree.treePath = "";

      const res = addTreeToTrees(MOCK_TREE_DATA, targetTree);
      const addedTree = res.treeChildren?.find(child => child.treeId === targetTree.treeId);

      expect(addedTree).toEqual(targetTree);
    });

    test("n depth 추가", () => {
      const targetTree = cloneDeep(NEW_TREE);
      targetTree.treePath = "6|7";

      const res = addTreeToTrees(MOCK_TREE_DATA, targetTree);

      const [ parentId1, parentId2 ] = targetTree.treePath.split('|').map(Number);

      const parentTree1 = res.treeChildren?.find(child => child.treeId === parentId1);
      const parentTree2 = parentTree1?.treeChildren?.find(child => child.treeId === parentId2);
      const addedTree = parentTree2?.treeChildren?.find(child => child.treeId === targetTree.treeId);

      expect(addedTree).toEqual(targetTree);
    });
  });

  describe("removeTreeFromTrees", () => {
    test("1 depth 제거", () => {
      const targetTree = cloneDeep(DEPTH_1_TREE);

      const res = removeTreeFromTrees(MOCK_TREE_DATA, targetTree);
      const treeIds = res.treeChildren?.map(child => child.treeId);

      expect(treeIds).not.toContain(targetTree.treeId);
    });

    test("n depth 제거", () => {
      const targetTree = cloneDeep(DEPTH_3_TREE);

      const res = removeTreeFromTrees(MOCK_TREE_DATA, targetTree);

      const [ parentId1, parentId2 ] = targetTree.treePath.split('|').map(Number);

      const parentTree1 = res.treeChildren?.find(child => child.treeId === parentId1);
      const parentTree2 = parentTree1?.treeChildren?.find(child => child.treeId === parentId2);
      const treeIds = parentTree2?.treeChildren?.map(child => child.treeId);

      expect(treeIds).not.toContain(targetTree.treeId);
    });
  });
});
