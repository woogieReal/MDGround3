import { Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateCreateTree, validateRenameTree } from "@/src/utils/tree/treeValidation";
import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type UpdateTreeData = (alternative: Partial<Tree>) => void;
export type UseTreeData = (
  initalTreeData: Tree
) => {
  treeData: Tree,
  updateTreeData: UpdateTreeData,
}
export const useTreeData: UseTreeData = (initalTreeData) => {
  const [treeData, setTreeData] = useState<Tree>(initalTreeData);

  useEffect(() => setTreeData(initalTreeData), [initalTreeData]);
  useEffect(() => setTreeData(initalTreeData), [initalTreeData.treeStatus]);

  const updateTreeData = (alternative: Partial<Tree>) => setTreeData({ ...treeData, ...alternative });

  return { treeData, updateTreeData };
}

export const checkEmptyTreeName = (treeData: Tree) => !treeData.treeName.trim();

export const checkDuplicateTreeName = (
  treeData: Tree,
  sameDepthTreeNames: Map<TreeType, string[]>,
  initialTreeName: string,
) => {
  let isDuplicated = true;
  const alreadyExistTreeNames = _.cloneDeep(sameDepthTreeNames.get(treeData.treeType)) || [];

  if (treeData.treeStatus === TreeStatusInfo.CREATE) {
    isDuplicated = alreadyExistTreeNames.includes(treeData.treeName);
  } else if (treeData.treeStatus === TreeStatusInfo.RENAME) {
    // 기존 트리 이름은 중복항목에서 제거
    alreadyExistTreeNames.splice(alreadyExistTreeNames.indexOf(initialTreeName), 1);
    isDuplicated = alreadyExistTreeNames.includes(treeData.treeName);
  }

  return isDuplicated;
}

export const checkValidTreeName = (
  treeData: Tree,
  sameDepthTreeNames: Map<TreeType, string[]>,
  initialTreeName: string,
) => {
  return !checkEmptyTreeName(treeData) && !checkDuplicateTreeName(treeData, sameDepthTreeNames, initialTreeName);
}

export type UseVerifyTreeName = (
  treeData: Tree,
  isTreeNameEditable: boolean,
  sameDepthTreeNames: Map<TreeType, string[]>,
  initialTreeName: string,
) => { isValidTreeName: boolean, setInvalidTreeName: Function }
export const useVerifyTreeName: UseVerifyTreeName = (treeData, isTreeNameEditable, sameDepthTreeNames, initialTreeName) => {
  const [isValidTreeName, setIsValidTreeName] = useState<boolean>(false);

  useEffect(() => {
    treeData.treeStatus === TreeStatusInfo.RENAME && setIsValidTreeName(true);
  }, [treeData.treeStatus]);

  useEffect(() => {
    isTreeNameEditable && setIsValidTreeName(checkValidTreeName(treeData, sameDepthTreeNames, initialTreeName));
  }, [treeData.treeName]);

  const setInvalidTreeName = () => setIsValidTreeName(false);

  return { isValidTreeName, setInvalidTreeName }
}

export const useTextFieldClassName = (
  styles: { readonly [key: string]: string; },
  isTreeNameEditable: boolean,
  isValidTreeName: boolean
) => {
  const [textFieldClassName, setTextFieldClassName] = useState<string>(styles.readOnly);

  useEffect(() => {
    if (isTreeNameEditable) {
      const classNames: string[] = [styles.editable];
      classNames.push(isValidTreeName ? styles.readyToCreateInput : styles.notReadyToCreateInput);
      setTextFieldClassName(classNames.join(' '));
    } else {
      setTextFieldClassName(styles.readOnly);
    }
  }, [isTreeNameEditable, isValidTreeName])

  return textFieldClassName;
}

export const useBackgroundColorCode = (
  multiSelectedTreeId: number[],
  treeData: Tree,
) => {
  const focusCode = '#EEE7E5';

  const [backgroundColorCode, setBackgroundColorCode] = useState<string>('');

  useEffect(() => {
    setBackgroundColorCode(checkMultiSelected(multiSelectedTreeId, treeData) ? focusCode : '');
  }, [multiSelectedTreeId, treeData])

  return backgroundColorCode;
}

export type CheckReadyToUpsert = (
  treeData: Tree,
  updateTreeData: UpdateTreeData,
  setIsReadyToUpsert: Dispatch<SetStateAction<boolean>>
) => void;
export const checkReadyToCreate: CheckReadyToUpsert = (treeData, updateTreeData, setIsReadyToCreate) => {
  const response: ValidationResponse<Tree> = validateCreateTree(treeData);
  updateTreeData(response.processedData)
  setIsReadyToCreate(response.isValid);
}
export const checkReadyToRename: CheckReadyToUpsert = (treeData, updateTreeData, setIsReadyToRename) => {
  const response: ValidationResponse<Tree> = validateRenameTree(treeData);
  updateTreeData(response.processedData);
  setIsReadyToRename(response.isValid);
}

export const checkMultiSelected = (multiSelectedTreeId: number[], treeData: Tree): boolean => multiSelectedTreeId.includes(treeData.treeId);

export const addOrRemoveIfExists = (treeDataList: Tree[], treeData: Tree) => _.some(treeDataList, { 'treeId': treeData.treeId }) ? _.reject(treeDataList, { 'treeId': treeData.treeId }) : _.concat(treeDataList, treeData);