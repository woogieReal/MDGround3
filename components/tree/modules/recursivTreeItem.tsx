import { MethodTypeForRecursivTreeItem, Tree, TreeType } from "@/src/models/tree.model";
import styles from '@/styles/tree.module.scss'
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, deleteTreeFromTrees, getTreeChildrenNames } from "@/src/utils/tree/treeUtil";
import React from "react";

interface Props {
  treeItem: Tree;
  setTrees: Dispatch<SetStateAction<Tree[]>>
  setMethodType: Dispatch<SetStateAction<MethodTypeForRecursivTreeItem>>
  setMethodTargetTree: Dispatch<SetStateAction<Tree>>
}
const RecursivTreeItem = ({ treeItem, setTrees, setMethodType, setMethodTargetTree }: Props) => {
  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  // 기존 트리 이름 변경
  const [renameTargetTree, setRenameTargetTree] = useState<Tree>();

  // 하위 트리 노출여부
  const [isShowChildrenTree, setIsShowChildrenTree] = useState<boolean>(false);

  const setMethod = (methodType: MethodTypeForRecursivTreeItem, methodTargetTree: Tree) => {
    setMethodType(methodType);
    setMethodTargetTree(methodTargetTree);
  }

  const handleTreeClickItem = () => {
    treeItem.treeType === TreeType.FORDER && setIsShowChildrenTree(show => !show);
    setMethod(MethodTypeForRecursivTreeItem.CLICK, treeItem);
  }

  const handleTreeDoubleClickItem = () => {
    setMethod(MethodTypeForRecursivTreeItem.DOUBLE_CLICK, treeItem);
  }

  const handleContextMenu = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const handleClickCreate = (treeType: TreeType) => {
    setIsOpenNewTree(true);
    setNewTreeType(treeType);
    setAnchorEl(null);
  }

  const handleAfterCreate = (newTree: Tree) => {
    setIsOpenNewTree(false);
    setTrees((currTrees: Tree[]) => addTreeToTrees(currTrees, newTree));
    setMethod(MethodTypeForRecursivTreeItem.DOUBLE_CLICK, newTree);
  }

  const handleClickRename = (tree: Tree) => {
    setRenameTargetTree(tree);
  }

  const handleAfterDelete = (deletedTree: Tree) => {
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, deletedTree));
    setMethod(MethodTypeForRecursivTreeItem.DELETE_TAB, deletedTree);
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

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
                {treeItem.treeType === TreeType.FORDER ? <FolderOutlinedIcon fontSize="small" sx={{ mr: -0.7, }} /> : <DescriptionOutlinedIcon fontSize="small" sx={{ mr: -0.7, }} />}
              </InputAdornment>
            ),
          }}
          disabled
          value={treeItem.treeName}
          className={styles.readOnly}
          onClick={handleTreeClickItem}
          onDoubleClick={handleTreeDoubleClickItem}
          onContextMenu={handleContextMenu}
        />
        {isShowChildrenTree && treeItem.treeChildren?.map((item: Tree) => (
          <Box style={{ marginLeft: '15px' }}>
            <RecursivTreeItem
              key={item.treeId}
              treeItem={item}
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
        targetTree={treeItem}
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
  );
  return isEqualProps;
}

/**
 * drawer 너비 조정 시 재귀함수로 생성된 모든 RecursivTreeItem가 rerender됨
 * 성능문제를 해결하기 위해 React.memo 사용 
 */
export default React.memo(RecursivTreeItem, isEqual)