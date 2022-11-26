import { InitialTree, Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeNameInput from '@/components/tree/modules/treeNameInput';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, deleteTreeFromTrees, getTreeChildrenNames } from "@/src/utils/tree/treeUtil";
import React from "react";

interface Props {
  treeItem: Tree;
  setTrees: Dispatch<SetStateAction<Tree[]>>
  handleTreeClick(data: Tree): void;
  handleTreeDoubleClick(data: Tree): void;
  deleteTabByTreeId(data: Tree): void;
}
const RecursivTreeItem = ({ treeItem, setTrees, handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId }: Props) => {
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
    handleTreeDoubleClick(newTree);
  }

  const handleClickRename = (tree: Tree) => {
    setRenameTargetTree(tree);
  }

  const handleAfterDelete = (deletedTree: Tree) => {
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, deletedTree));
    deleteTabByTreeId(deletedTree);
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
          onClick={() => {
            if (treeItem.treeType === TreeType.FORDER) {
              setIsShowChildrenTree(show => !show);
            }
            handleTreeClick(treeItem)
          }}
          onDoubleClick={() => handleTreeDoubleClick(treeItem)}
          onContextMenu={handleContextMenu}
        />
        {isShowChildrenTree && treeItem.treeChildren?.map((item: Tree) => (
          <Box style={{ marginLeft: '15px' }}>
            <RecursivTreeItem
              key={item.treeId}
              treeItem={item}
              setTrees={setTrees}
              handleTreeClick={handleTreeClick}
              handleTreeDoubleClick={handleTreeDoubleClick}
              deleteTabByTreeId={deleteTabByTreeId}
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
    && prev.handleTreeClick === next.handleTreeClick
    && prev.handleTreeDoubleClick === next.handleTreeDoubleClick
    && prev.deleteTabByTreeId === next.deleteTabByTreeId
  );
  return isEqualProps;
}

/**
 * drawer 너비 조정 시 재귀함수로 생성된 모든 RecursivTreeItem가 rerender됨
 * 성능문제를 해결하기 위해 React.memo 사용 
 */
export default React.memo(RecursivTreeItem, isEqual)