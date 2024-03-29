import { MultiTreeCutOrCopy, Tree, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateExecutor } from "../common/commonValidation";
import _ from 'lodash';

type ValidateSingleTreeFn = <T extends Tree>(tree: T) => ValidationResponse<T>;
const checkInvalidSingleTreeId = (treeId: number) => treeId <= 0;
const checkInvalidSingleTreeType = (treeType: TreeType) => ![...Object.values(TreeType)].includes(treeType);
const checkInvalidSingleTreeName = (treeName: string) => !treeName;
const checkInvalidSingleTreeContent = (treeContent: any) => typeof treeContent === 'undefined' || treeContent === null;

type ValidateMultiTreeFn = <T extends Tree[]>(treeList: T) => ValidationResponse<T>;
const checkInvalidMultiTreeId = (treeIdList: number[]) => treeIdList.reduce((res, treeId) => _.concat(res, checkInvalidSingleTreeId(treeId)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeType = (treeTypeList: TreeType[]) => treeTypeList.reduce((res, treeType) => _.concat(res, checkInvalidSingleTreeType(treeType)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeName = (treeNameList: string[]) => treeNameList.reduce((res, treeName) => _.concat(res, checkInvalidSingleTreeName(treeName)), [] as boolean[]).includes(true);
const checkInvalidMultiTreeContent = (treeContentList: any[]) => treeContentList.reduce((res, treeContent) => _.concat(res, checkInvalidSingleTreeContent(treeContent)), [] as boolean[]).includes(true);

type ValidateMultiTreeCutAndCopyFn = (cutAndCopyTree: MultiTreeCutOrCopy) => ValidationResponse<MultiTreeCutOrCopy>;

export const validateCreateTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: typeof tree): Array<boolean> => {
    return [checkInvalidSingleTreeType(processedData.treeType), checkInvalidSingleTreeName(processedData.treeName)];
  })
}

export const validateEditContentTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, [], (processedData: typeof tree): Array<boolean> => {
    return [checkInvalidSingleTreeId(processedData.treeId), checkInvalidSingleTreeContent(processedData.treeContent)];
  })
}

export const validateDeleteTree: ValidateMultiTreeFn = (treeList) => {
  return validateExecutor(treeList, [], (processedData: typeof treeList): Array<boolean> => {
    return [checkInvalidMultiTreeId(_.map(processedData, 'treeId')), checkInvalidMultiTreeType(_.map(processedData, 'treeType'))];
  })
}

export const validateRenameTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: typeof tree): Array<boolean> => {
    return [checkInvalidSingleTreeId(processedData.treeId), checkInvalidSingleTreeName(processedData.treeName)];
  })
};

export const validateCutOrCopyTree: ValidateMultiTreeCutAndCopyFn = (cutAndCopyTree) => {
  return validateExecutor(cutAndCopyTree, [], (processedData: typeof cutAndCopyTree): Array<boolean> => {
    return [
      checkInvalidSingleTreeId(processedData.toTree.treeId),
      checkInvalidMultiTreeId(_.map(processedData.targetTreeList, 'treeId')),
      checkInvalidMultiTreeId(_.map(processedData.targetTreeList, 'treeType'))
    ];
  })
}