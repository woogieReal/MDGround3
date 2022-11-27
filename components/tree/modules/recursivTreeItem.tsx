import { InitialTree, MethodTypeForRecursivTreeItem, TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import styles from '@/styles/tree.module.scss'
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, changeTreeFromTrees, checkEditableTreeNameStatus, createTreeFullPath, deleteTreeFromTrees, getTreeChildrenNames } from "@/src/utils/tree/treeUtil";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { isEnter } from "@/src/utils/common/keyPressUtil";
import { validateCreateTree } from "@/src/utils/tree/validation";
import { ValidationResponse } from "@/src/models/validation.model";
import { getEmptyArrayIfNotArray } from "@/src/utils/common/arrayUtil";
import { cloneDeep } from "lodash";

interface Props {
  treeItem: Tree;
  sameDepthTreeNames: Map<TreeType, string[]>;
  setTrees: Dispatch<SetStateAction<Tree[]>>
  setMethodType: Dispatch<SetStateAction<MethodTypeForRecursivTreeItem>>
  setMethodTargetTree: Dispatch<SetStateAction<Tree>>
}
const RecursivTreeItem = ({ treeItem, sameDepthTreeNames, setTrees, setMethodType, setMethodTargetTree }: Props) => {
  const [treeData, setTreeData] = useState<Tree>(treeItem);

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

  // 컨텍스트
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleContextMenu = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const setMethod = (methodType: MethodTypeForRecursivTreeItem, methodTargetTree: Tree) => {
    setMethodType(methodType);
    setMethodTargetTree(methodTargetTree);
  }

  const handleClickCreate = (treeType: TreeType) => {
    setAnchorEl(null);
    const newTree: Tree = { ...InitialTree, treeType: treeType, treePath: createTreeFullPath(treeData), treeStatus: TreeStatusInfo.CREATE };
    setTreeData((currTree: Tree) => {
      const copy: Tree = cloneDeep(currTree);
      copy.treeChildren = getEmptyArrayIfNotArray(copy.treeChildren);
      copy.treeChildren.push(newTree);
      return copy;
    });
  }

  const handleClickRename = (tree: Tree) => {
    setTreeData((currTree: Tree) => { return { ...currTree, treeStatus: TreeStatusInfo.RENAME } });
  }

  const handleAfterDelete = (deletedTree: Tree) => {
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, deletedTree));
    setMethod(MethodTypeForRecursivTreeItem.DELETE_TAB, deletedTree);
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])
  // -- 컨텍스트

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
  },[isTreeNameEditable, isValidTreeName])
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
    setTreeData(createdTree);
    setMethod(MethodTypeForRecursivTreeItem.DOUBLE_CLICK, createdTree);
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
    <Box>
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
        {isShowChildrenTree && treeData.treeChildren?.map((item: Tree) => (
          <Box style={{ marginLeft: '15px' }}>
            <RecursivTreeItem
              key={item.treeId}
              treeItem={item}
              sameDepthTreeNames={getTreeChildrenNames(treeData)}
              setTrees={setTrees}
              setMethodType={setMethodType}
              setMethodTargetTree={setMethodTargetTree}
            />
          </Box>
        ))}
      </Box>
      <TreeContext
        anchorEl={anchorEl}
        isShow={isPopupOpen}
        hide={handleClosePopup}
        targetTree={treeData}
        handleAfterDelete={handleAfterDelete}
        handleClickCreate={handleClickCreate}
        handleClickRename={handleClickRename}
      />
    </Box>
  )
}

const isEqual = (prev: Readonly<Props>, next: Readonly<Props>): boolean => {
  const isEqualProps = (
    prev.treeItem === next.treeItem
    && prev.setTrees === next.setTrees
    && prev.setMethodType === next.setMethodType
    && prev.setMethodTargetTree === next.setMethodTargetTree
  );
  return isEqualProps;
}

/**
 * drawer 너비 조정 시 재귀함수로 생성된 모든 RecursivTreeItem가 rerender됨
 * 성능문제를 해결하기 위해 React.memo 사용 
 */
export default React.memo(RecursivTreeItem, isEqual)