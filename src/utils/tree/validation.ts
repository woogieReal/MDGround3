import { Tree, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";

export const validateCreateTree = (tree: Tree): ValidationResponse => {
  const response: ValidationResponse = {
    isValid: false,
    processedData: tree,
  };
  validating: try {
    const processedTree: Tree = { ...tree, treeName: tree.treeName.trim() };

    if (!processedTree.treeName) break validating;
    if (![...Object.values(TreeType)].includes(processedTree.treeType)) break validating;

    response.isValid = true;
    response.processedData = processedTree;
  } catch (err) {
    throw err;
  }

  return response;
};
