import { RecursivTreeEvent, TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import styles from '@/styles/tree.module.scss'
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { getTreeChildrenNames } from "@/src/utils/tree/treeUtil";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { checkPressedEnter } from "@/src/utils/common/keyPressUtil";
import { checkEditableTreeNameStatus } from "@/src/utils/tree/treeCheck";
import { removeTreeFromUpper } from "@/src/utils/tree/treeCRUD";
import { addOrRemoveIfExists, checkEmptyTreeName, checkMultiSelected, checkReadyToCreate, checkReadyToRename, checkValidTreeName, useBackgroundColorCode, useTextFieldClassName, useTreeData, useVerifyTreeName } from "./utils/recursivTreeItem";
import _ from "lodash";

interface Props {
  treeItem: Tree;
  sameDepthTreeNames: Map<TreeType, string[]>;
  multiSelectedTreeId: number[];
  setRootTree: Dispatch<SetStateAction<Tree>>
  setMethodType: Dispatch<SetStateAction<RecursivTreeEvent>>
  setMethodTargetTree: Dispatch<SetStateAction<Tree>>
  setMethodTargetTreeList: Dispatch<SetStateAction<Tree[]>>
  setContextEvent: Dispatch<SetStateAction<React.BaseSyntheticEvent<MouseEvent> | null>>
}
const RecursivTreeItem = ({ treeItem, sameDepthTreeNames, multiSelectedTreeId, setRootTree, setMethodType, setMethodTargetTree, setMethodTargetTreeList, setContextEvent }: Props) => {
  const { treeData, updateTreeData } = useTreeData(treeItem);
  const childSameDepthTreeNames = getTreeChildrenNames(treeData.treeChildren || []);

  const setMethod = (methodType: RecursivTreeEvent, methodTargetTree: Tree) => {
    setMethodType(methodType);
    setMethodTargetTree(methodTargetTree);
  }

  // 트리 클릭
  const [isShowChildrenTree, setIsShowChildrenTree] = useState<boolean>(false);

  const handleTreeClickItem = (e: any) => {
    if (isTreeNameEditable) {
      return;
    }

    if (e.metaKey) {
      setMethodTargetTreeList(treeList => { return addOrRemoveIfExists(treeList, treeData) });
      return;
    }

    treeData.treeType === TreeType.FORDER && setIsShowChildrenTree(show => !show);
    setMethod(['target', 'click'], treeData);
  }

  const handleTreeDoubleClickItem = () => setMethod(['target', 'doubleClick'], treeData);
  // -- 트리 클릭

  // 트리 우클릭
  const handleContextMenu = (e: React.BaseSyntheticEvent<MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setContextEvent(e);
    setMethod(['context', 'openContext'], treeData)
  }
  // -- 트리 우클릭

  // 트리 이름 관련 공통
  const isTreeNameEditable = checkEditableTreeNameStatus(treeData);
  const { isValidTreeName, setInvalidTreeName } = useVerifyTreeName(treeData, isTreeNameEditable, sameDepthTreeNames, treeItem.treeName);
  const textFieldClassName = useTextFieldClassName(styles, isTreeNameEditable, isValidTreeName);
  const backgroundColorCode = useBackgroundColorCode(multiSelectedTreeId, treeData);

  const handleChangeName = (e: React.BaseSyntheticEvent) => updateTreeData({ treeName: e.target.value });

  const handlBlurNewTreeInput = () => {
    if (treeData.treeStatus === TreeStatusInfo.CREATE) {
      if (checkEmptyTreeName(treeData)) {
        cleanCreateTreeAllState();
        setRootTree((currRootTree: Tree) => removeTreeFromUpper(currRootTree, treeData));
      } else if (checkValidTreeName(treeData, sameDepthTreeNames, treeItem.treeName)) {
        checkReadyToCreate(treeData, updateTreeData, setIsReadyToCreate);
      }

    } else if (treeData.treeStatus === TreeStatusInfo.RENAME) {
      if (checkEmptyTreeName(treeData)) {
        cleanRenameTreeAllState();

        updateTreeData({
          treeName: treeItem.treeName,
          treeStatus: TreeStatusInfo.DEFAULT
        });
      } else if (checkValidTreeName(treeData, sameDepthTreeNames, treeItem.treeName)) {
        checkReadyToRename(treeData, updateTreeData, setIsReadyToRename);
      }
    }
  }

  const handleKeyPressTreeInput = (e: any) => {
    if (checkPressedEnter(e) && isValidTreeName) {
      if (treeData.treeStatus === TreeStatusInfo.CREATE) {
        checkReadyToCreate(treeData, updateTreeData, setIsReadyToCreate);
      } else if (treeData.treeStatus === TreeStatusInfo.RENAME) {
        checkReadyToRename(treeData, updateTreeData, setIsReadyToRename);
      }
    }
  }
  // -- 트리 이름 관련 공통

  // 새로운 트리 생성
  const [isReadyToCreate, setIsReadyToCreate] = useState<boolean>(false);

  const createTree = useMutation(async () => await ApiHandler.callApi(ApiName.CREATE_TREE, null, { ...treeData, userId: TEST_USER_ID }), {
    onSuccess(res: AxiosResponse) {
      handleAfterCreate(res.data as Tree);
    },
  });

  const handleAfterCreate = (createdTree: Tree) => {
    cleanCreateTreeAllState();
    setRootTree((currRootTree: Tree) => removeTreeFromUpper(currRootTree, treeData));
    setMethod(['target', 'create'], createdTree);
  }

  const cleanCreateTreeAllState = () => {
    setInvalidTreeName();
    setIsReadyToCreate(false);
  }

  useEffect(() => {
    isReadyToCreate && createTree.mutate();
  }, [isReadyToCreate])
  // -- 새로운 트리 생성

  // 기존 트리 이름 수정
  const [isReadyToRename, setIsReadyToRename] = useState<boolean>(false);
  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { ...treeData, treeStatus: TreeStatusInfo.RENAME, userId: TEST_USER_ID, }, treeData.treeId), {
    onSuccess(res: AxiosResponse) {
      handleAfterRename();
    },
  });

  const handleAfterRename = () => {
    cleanRenameTreeAllState();
    updateTreeData({ treeStatus: TreeStatusInfo.DEFAULT });
    setMethod(['target', 'rename'], { ...treeData, treeStatus: TreeStatusInfo.DEFAULT });
  }

  const cleanRenameTreeAllState = () => {
    setInvalidTreeName();
    setIsReadyToRename(false);
  }

  useEffect(() => {
    isReadyToRename && updateTree.mutate();
  }, [isReadyToRename])
  // -- 기존 트리 이름 수정

  return (
    <Box className={`${styles.treeItemBox}`}>
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
        style={{ backgroundColor: backgroundColorCode }}
        onClick={handleTreeClickItem}
        onDoubleClick={handleTreeDoubleClickItem}
        onContextMenu={handleContextMenu}
        onChange={handleChangeName}
        onBlur={handlBlurNewTreeInput}
        onKeyUp={handleKeyPressTreeInput}
      />
      {isShowChildrenTree && treeData.treeChildren?.map((item: Tree) => {
        return (
          <Box style={{ marginLeft: '15px' }}>
            <RecursivTreeItem
              key={item.treeId}
              treeItem={item}
              sameDepthTreeNames={childSameDepthTreeNames}
              multiSelectedTreeId={multiSelectedTreeId}
              setRootTree={setRootTree}
              setMethodType={setMethodType}
              setMethodTargetTree={setMethodTargetTree}
              setMethodTargetTreeList={setMethodTargetTreeList}
              setContextEvent={setContextEvent}
            />
          </Box>
        );
      })}
    </Box>
  )
}

const NEED_CHECK_EQUAL_PROPERTY: {[k in keyof Props]: boolean} = {
  treeItem: true,
  sameDepthTreeNames: true,
  multiSelectedTreeId: true,
  setRootTree: true,
  setMethodType: true,
  setMethodTargetTree: true,
  setMethodTargetTreeList: true,
  setContextEvent: true,
}

const checkEqual = (prev: Readonly<Props>, next: Readonly<Props>): boolean => {
  let k: keyof Props;
  for (k in prev) {
    if (prev[k] !== next[k] && NEED_CHECK_EQUAL_PROPERTY[k]) {
      return false;
    }
  }
  return true;
}

/**
 * drawer 너비 조정 시 재귀함수로 생성된 모든 RecursivTreeItem가 rerender됨
 * 성능문제를 해결하기 위해 React.memo 사용 
 */
export default React.memo(RecursivTreeItem, checkEqual)