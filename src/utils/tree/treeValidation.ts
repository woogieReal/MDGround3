import { Tree, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateExecutor } from "../common/commonValidation";
import _ from 'lodash';

type ValidateSingleTreeFn = (tree: Tree) => ValidationResponse<Tree>;
const checkInvalidSingleTreeId = (treeId: number) => treeId <= 0;
const checkInvalidSingleTreeType = (treeType: TreeType) => ![...Object.values(TreeType)].includes(treeType);
const checkInvalidSingleTreeName = (treeName: string) => !treeName;
const checkInvalidSingleTreeContent = (treeContent: any) => typeof treeContent === 'undefined' || treeContent === null;

type ValidateMultiTreeFn = (treeList: Tree[]) => ValidationResponse<Tree[]>;
const checkInvalidMultiTreeId = (treeIdList: number[]) => treeIdList.reduce((res, treeId) => _.concat(res, checkInvalidSingleTreeId(treeId)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeType = (treeTypeList: TreeType[]) => treeTypeList.reduce((res, treeType) => _.concat(res, checkInvalidSingleTreeType(treeType)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeName = (treeNameList: string[]) => treeNameList.reduce((res, treeName) => _.concat(res, checkInvalidSingleTreeName(treeName)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeContent = (treeContentList: any[]) => treeContentList.reduce((res, treeContent) => _.concat(res, checkInvalidSingleTreeContent(treeContent)), [] as boolean[]).includes(true);

export const validateCreateTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: Tree): Array<boolean> => {
    return [checkInvalidSingleTreeType(processedData.treeType), checkInvalidSingleTreeName(processedData.treeName)];
  })
}

export const validateEditContentTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, [], (processedData: Tree): Array<boolean> => {
    return [checkInvalidSingleTreeId(processedData.treeId), checkInvalidSingleTreeContent(processedData.treeContent)];
  })
}

export const validateDeleteTree: ValidateMultiTreeFn = (treeList) => {
  return validateExecutor(treeList, [], (processedData: Tree[]): Array<boolean> => {
    return [checkInvalidMultiTreeId(_.map(processedData, 'treeId')), checkInvalidMultiTreeType(_.map(processedData, 'treeType'))];
  })
}

export const validateRenameTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: Tree): Array<boolean> => {
    return [checkInvalidSingleTreeId(processedData.treeId), checkInvalidSingleTreeName(processedData.treeName)];
  })
};