import { Tree, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateExecutor } from "../common/commonValidation";

const checkInvalidTreeId = (treeId: number) => treeId <= 0;
const checkInvalidTreeType = (treeType: TreeType) => ![...Object.values(TreeType)].includes(treeType);
const checkInvalidTreeName = (treeName: string) => !treeName;
const checkInvalidTreeContent = (treeContent: any) => typeof treeContent === 'undefined' || treeContent === null;

export const validateCreateTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, ['treeName'], (processedData: T): Array<boolean> => {
    return [checkInvalidTreeType(processedData.treeType), checkInvalidTreeName(processedData.treeName)];
  })
}

export const validateEditContentTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, [], (processedData: T): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeContent(processedData.treeContent)];
  })
}

export const validateDeleteTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, [], (processedData: T): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeType(processedData.treeType)];
  })
}

export const validateRenameTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, ['treeName'], (processedData: T): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeName(processedData.treeName)];
  })
};