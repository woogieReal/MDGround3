import { describe, expect, test } from "@jest/globals";
import { addTreeToRootTree, findParentTreeFromRootTree, removeTreeFromRootTree } from "@/src/utils/tree/treeCRUD";
import { DEPTH_1_TREE, DEPTH_3_TREE, MOCK_TREE_DATA, NEW_TREE } from "@/tests/tree/mockData";
import { cloneDeep } from "lodash";
import { ROOT_TREE_ID } from "@/src/models/tree.model";

describe("treeCRUD", () => {
  describe("findParentTreeFromRootTree", () => {
    test("targetTree의 depth가 1일 때", () => {
      const res = findParentTreeFromRootTree(MOCK_TREE_DATA, DEPTH_1_TREE);
      expect(res._tag === 'Some' && res.value.treeId).toBe(ROOT_TREE_ID);
    });
  
    test("targetTree의 depth가 n일 때", () => {
      const res = findParentTreeFromRootTree(MOCK_TREE_DATA, DEPTH_3_TREE);

      const targetTree = cloneDeep(DEPTH_3_TREE);
      const [ parentId1, parentId2 ] = targetTree.treePath.split('|').map(Number);

      expect(res._tag === 'Some' && res.value.treeId).toBe(parentId2);
    });
  });

  describe("addTreeToRootTree", () => {
    test("1 depth 추가", () => {
      const targetTree = cloneDeep(NEW_TREE);
      targetTree.treePath = "";

      const res = addTreeToRootTree(MOCK_TREE_DATA, targetTree);
      const addedTree = res.treeChildren?.find(child => child.treeId === targetTree.treeId);

      expect(addedTree).toEqual(targetTree);
    });

    test("n depth 추가", () => {
      const targetTree = cloneDeep(NEW_TREE);
      targetTree.treePath = "6|7";

      const res = addTreeToRootTree(MOCK_TREE_DATA, targetTree);

      const [ parentId1, parentId2 ] = targetTree.treePath.split('|').map(Number);

      const parentTree1 = res.treeChildren?.find(child => child.treeId === parentId1);
      const parentTree2 = parentTree1?.treeChildren?.find(child => child.treeId === parentId2);
      const addedTree = parentTree2?.treeChildren?.find(child => child.treeId === targetTree.treeId);

      expect(addedTree).toEqual(targetTree);
    });
  });

  describe("removeTreeFromRootTree", () => {
    test("1 depth 제거", () => {
      const targetTree = cloneDeep(DEPTH_1_TREE);

      const res = removeTreeFromRootTree(MOCK_TREE_DATA, targetTree);
      const treeIds = res.treeChildren?.map(child => child.treeId);

      expect(treeIds).not.toContain(targetTree.treeId);
    });

    test("n depth 제거", () => {
      const targetTree = cloneDeep(DEPTH_3_TREE);

      const res = removeTreeFromRootTree(MOCK_TREE_DATA, targetTree);

      const [ parentId1, parentId2 ] = targetTree.treePath.split('|').map(Number);

      const parentTree1 = res.treeChildren?.find(child => child.treeId === parentId1);
      const parentTree2 = parentTree1?.treeChildren?.find(child => child.treeId === parentId2);
      const treeIds = parentTree2?.treeChildren?.map(child => child.treeId);

      expect(treeIds).not.toContain(targetTree.treeId);
    });
  });
});
