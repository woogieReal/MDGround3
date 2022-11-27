import { Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
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

export const validateEditContentTree = (tree: Tree): ValidationResponse => {
  const response: ValidationResponse = {
    isValid: false,
    processedData: tree,
  };
  validating: try {
    const processedTree: Tree = { ...tree };
    delete processedTree.treeChildren;

    if (processedTree.treeId <= 0) break validating;
    if (!processedTree.hasOwnProperty('treeContent')) break validating;

    processedTree.treeStatus = TreeStatusInfo.EDIT_CONTENT;

    response.isValid = true;
    response.processedData = processedTree;
  } catch (err) {
    throw err;
  }

  return response;
};

export const validateDeleteTree = (tree: Tree): ValidationResponse => {
  const response: ValidationResponse = {
    isValid: false,
    processedData: tree,
  };
  validating: try {
    const processedTree: Tree = { ...tree };
    delete processedTree.treeContent;
    delete processedTree.treeChildren;

    if (processedTree.treeId <= 0) break validating;
    if (![...Object.values(TreeType)].includes(processedTree.treeType)) break validating;

    response.isValid = true;
    response.processedData = processedTree;
  } catch (err) {
    throw err;
  }

  return response;
};

export const validateRenameTree = (tree: Tree): ValidationResponse => {
  const response: ValidationResponse = {
    isValid: false,
    processedData: tree,
  };
  validating: try {
    const processedTree: Tree = { ...tree, treeName: tree.treeName.trim() };
    delete processedTree.treeContent;
    delete processedTree.treeChildren;

    if (processedTree.treeId <= 0) break validating;
    if (!processedTree.treeName) break validating;
    if (![...Object.values(TreeType)].includes(processedTree.treeType)) break validating;

    processedTree.treeStatus = TreeStatusInfo.RENAME;

    response.isValid = true;
    response.processedData = processedTree;
  } catch (err) {
    throw err;
  }

  return response;
};