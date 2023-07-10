import { Tree, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateExecutor } from "../common/commonValidation";

const checkInvalidTreeId = (treeId: number) => treeId <= 0;
const checkInvalidTreeType = (treeType: TreeType) => ![...Object.values(TreeType)].includes(treeType);
const checkInvalidTreeName = (treeName: string) => !treeName;
const checkInvalidTreeContent = (treeContent: any) => typeof treeContent === 'undefined' || treeContent === null;

type ValidateSingleTreeFn = (tree: Tree) => ValidationResponse<Tree>;

export const validateCreateTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: Tree): Array<boolean> => {
    return [checkInvalidTreeType(processedData.treeType), checkInvalidTreeName(processedData.treeName)];
  })
}

export const validateEditContentTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, [], (processedData: Tree): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeContent(processedData.treeContent)];
  })
}

export const validateDeleteTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, [], (processedData: Tree): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeType(processedData.treeType)];
  })
}

export const validateRenameTree: ValidateSingleTreeFn = (tree) => {
  return validateExecutor(tree, ['treeName'], (processedData: Tree): Array<boolean> => {
    return [checkInvalidTreeId(processedData.treeId), checkInvalidTreeName(processedData.treeName)];
  })
};