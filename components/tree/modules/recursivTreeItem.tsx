import { MethodTypeForRecursivTreeItem, TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import styles from '@/styles/tree.module.scss'
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeContext from '@/components/tree/modules/treeContext';
import { checkEditableTreeNameStatus, deleteTreeFromTrees, getTreeChildrenNames } from "@/src/utils/tree/treeUtil";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { isEnter } from "@/src/utils/common/keyPressUtil";
import { validateCreateTree } from "@/src/utils/tree/validation";
import { ValidationResponse } from "@/src/models/validation.model";

interface Props {
  treeItem: Tree;
  sameDepthTreeNames: Map<TreeType, string[]>;
  setTrees: Dispatch<SetStateAction<Tree[]>>
  setMethodType: Dispatch<SetStateAction<MethodTypeForRecursivTreeItem>>
  setMethodTargetTree: Dispatch<SetStateAction<Tree>>
  setContextEvent: Dispatch<SetStateAction<React.BaseSyntheticEvent | null>>
}
const RecursivTreeItem = ({ treeItem, sameDepthTreeNames, setTrees, setMethodType, setMethodTargetTree, setContextEvent }: Props) => {
  const [treeData, setTreeData] = useState<Tree>(treeItem);
  useEffect(() => setTreeData(treeItem), [treeItem])
  useEffect(() => {
    if (treeItem.treeStatus) {
      const statusProcessedTree = { ...treeItem, treeStatus: treeItem.treeStatus === TreeStatusInfo.RE_RENDER ? TreeStatusInfo.DEFAULT : treeItem.treeStatus };
      setTreeData(statusProcessedTree);
    }
  }, [treeItem.treeStatus])

  const childSameDepthTreeNames = getTreeChildrenNames(treeData);

  const setMethod = (methodType: MethodTypeForRecursivTreeItem, methodTargetTree: Tree) => {
    setMethodType(methodType);
    setMethodTargetTree(methodTargetTree);
  }

  // 트리 클릭
  const [isShowChildrenTree, setIsShowChildrenTree] = useState<boolean>(false);

  const handleTreeClickItem = () => {
    treeData.treeType === TreeType.FORDER && setIsShowChildrenTree(show => !show);
    setMethod(MethodTypeForRecursivTreeItem.CLICK, treeData);
  }

  const handleTreeDoubleClickItem = () => {
    setMethod(MethodTypeForRecursivTreeItem.DOUBLE_CLICK, treeData);
  }
  // -- 트리 클릭

  // 트리 우클릭
  const handleContextMenu = (e: React.BaseSyntheticEvent) => {
    setContextEvent(e);
    setMethod(MethodTypeForRecursivTreeItem.OPEN_CONTEXT, treeData)
  }
  // -- 트리 우클릭

  // 트리 이름 수정
  const isTreeNameEditable = checkEditableTreeNameStatus(treeData);
  const [isValidTreeName, setIsValidTreeName] = useState<boolean>(false);
  const [textFieldClassName, setTextFieldClassName] = useState<string>(styles.readOnly);

  const handleChangeName = (e: React.BaseSyntheticEvent) => {
    setTreeData((currTree: Tree) => { return { ...currTree, treeName: e.target.value } })
  }

  useEffect(() => {
    if (isTreeNameEditable) {
      const classNames: string[] = [styles.editable];
      classNames.push(isValidTreeName ? styles.readyToCreateInput : styles.notReadyToCreateInput);
      setTextFieldClassName(classNames.join(' '));
    } else {
      setTextFieldClassName(styles.readOnly);
    }
  }, [isTreeNameEditable, isValidTreeName])
  // -- 트리 이름 수정

  // 새로운 트리 생성
  const [isReadyToCreate, setIsReadyToCreate] = useState<boolean>(false);

  const createTree = useMutation(async () => await ApiHandler.callApi(ApiName.CREATE_TREE, null, { ...treeData, userId: TEST_USER_ID }), {
    onSuccess(res: AxiosResponse) {
      handleAfterCreate(res.data as Tree);
    },
  });

  const handleAfterCreate = (createdTree: Tree) => {
    cleanCreateTreeAllState();
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, treeData));
    setMethod(MethodTypeForRecursivTreeItem.CREATE, createdTree);
  }

  const cleanCreateTreeAllState = () => {
    setIsValidTreeName(false);
    setIsReadyToCreate(false);
  }

  const checkEmptyTreeName = () => !treeData.treeName.trim();
  const checkDuplicateTreeName = () => {
    return sameDepthTreeNames.get(treeData.treeType)!.includes(treeData.treeName);
  }

  const checkValidTreeName = () => {
    return !checkEmptyTreeName() && !checkDuplicateTreeName();
  }

  const handlBlurNewTreeInput = () => {
    if (checkEmptyTreeName()) {
      cleanCreateTreeAllState();

      if (treeData.treeStatus === TreeStatusInfo.CREATE) {
        setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, treeData));
      }
    } else if (checkValidTreeName()) {
      checkReadyToCreate();
    }
  }

  const handleKeyPressNewTreeInput = (e: any) => {
    isEnter(e) && isValidTreeName && checkReadyToCreate();
  }

  const checkReadyToCreate = () => {
    const response: ValidationResponse = validateCreateTree(treeData);
    setTreeData(response.processedData)
    setIsReadyToCreate(response.isValid);
  }

  useEffect(() => {
    isTreeNameEditable && setIsValidTreeName(checkValidTreeName());
  }, [treeData.treeName])

  useEffect(() => {
    isReadyToCreate && createTree.mutate();
  }, [isReadyToCreate])

  // -- 새로운 트리 생성

  return (
    <Box
      className={`${styles.treeItemBox}`}
      sx={{ display: 'inline-block' }}
    >
      <TextField
        size="small"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {treeData.treeType === TreeType.FORDER ? <FolderOutlinedIcon fontSize="small" sx={{ mr: -0.7, }} /> : <DescriptionOutlinedIcon fontSize="small" sx={{ mr: -0.7, }} />}
            </InputAdornment>
          ),
        }}
        disabled={!isTreeNameEditable}
        value={treeData.treeName}
        className={textFieldClassName}
        onClick={handleTreeClickItem}
        onDoubleClick={handleTreeDoubleClickItem}
        onContextMenu={handleContextMenu}
        onChange={handleChangeName}
        onBlur={handlBlurNewTreeInput}
        onKeyUp={handleKeyPressNewTreeInput}
      />
      {isShowChildrenTree && treeData.treeChildren?.map((item: Tree) => {
        return (
          <Box style={{ marginLeft: '15px' }}>
            <RecursivTreeItem
              key={item.treeId}
              treeItem={item}
              sameDepthTreeNames={childSameDepthTreeNames}
              setTrees={setTrees}
              setMethodType={setMethodType}
              setMethodTargetTree={setMethodTargetTree}
              setContextEvent={setContextEvent}
            />
          </Box>
        );
      })}
    </Box>
  )
}

const checkIsEqual = (prev: Readonly<Props>, next: Readonly<Props>): boolean => {
  const isEqual = (
    next.treeItem.treeStatus !== TreeStatusInfo.RE_RENDER
    && prev.treeItem === next.treeItem
    && prev.sameDepthTreeNames === next.sameDepthTreeNames
    && prev.setTrees === next.setTrees
    && prev.setMethodType === next.setMethodType
    && prev.setMethodTargetTree === next.setMethodTargetTree
    && prev.setContextEvent === next.setContextEvent
  );
  if (next.treeItem.treeStatus === TreeStatusInfo.RE_RENDER) {
    // console.log(next.treeItem);
    next.treeItem.treeStatus = TreeStatusInfo.DEFAULT;
  }
  return isEqual;
}

/**
 * drawer 너비 조정 시 재귀함수로 생성된 모든 RecursivTreeItem가 rerender됨
 * 성능문제를 해결하기 위해 React.memo 사용 
 */
export default React.memo(RecursivTreeItem, checkIsEqual)