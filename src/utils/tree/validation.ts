import { Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateExecutor } from "../common/commonValidation";

export const validateCreateTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, ['treeName'], (processedData: T): Array<boolean> => {
    return [!processedData.treeName, ![...Object.values(TreeType)].includes(processedData.treeType)];
  })
}

export const validateEditContentTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, [], (processedData: T): Array<boolean> => {
    return [processedData.treeId <= 0, !processedData.hasOwnProperty('treeContent')];
  })
}

export const validateDeleteTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, [], (processedData: T): Array<boolean> => {
    return [processedData.treeId <= 0, ![...Object.values(TreeType)].includes(processedData.treeType)];
  })
}

export const validateRenameTree = <T extends Tree>(tree: T): ValidationResponse<T> => {
  return validateExecutor(tree, ['treeName'], (processedData: T): Array<boolean> => {
    return [processedData.treeId <= 0, !processedData.treeName];
  })
};