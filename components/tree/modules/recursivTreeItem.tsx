import { InitialTree, Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeNameInput from '@/components/tree/modules/treeNameInput';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, deleteTreeFromTrees } from "@/src/utils/tree/treeUtil";

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

  const hasChildren = treeItem && treeItem.treeChildren?.length! > 0 ? true : false;

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

  const handleAfterDelete = (deletedTree: Tree) => {
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, deletedTree));
    deleteTabByTreeId(deletedTree);
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  return (
    <Box>
      <TreeItem
        id={String(treeItem.treeId)}
        nodeId={String(treeItem.treeId)}
        label={treeItem.treeName}
        className={styles.treeItem}
        icon={treeItem.treeType === TreeType.FORDER ? <FolderOutlinedIcon /> : <DescriptionOutlinedIcon />}
        onClick={() => handleTreeClick(treeItem)}
        onDoubleClick={() => handleTreeDoubleClick(treeItem)}
        onContextMenu={handleContextMenu}
      >
        {hasChildren && treeItem.treeChildren?.map((item: Tree) => (
          <RecursivTreeItem
            key={item.treeId}
            treeItem={item}
            setTrees={setTrees}
            handleTreeClick={handleTreeClick}
            handleTreeDoubleClick={handleTreeDoubleClick}
            deleteTabByTreeId={deleteTabByTreeId}
          />
        ))}
        <TreeNameInput
          isShow={isOpenNewTree}
          uppertree={treeItem}
          treeType={newTreeType}
          handleAfterCreate={handleAfterCreate}
        />
        <TreeContext
          anchorEl={anchorEl}
          isShow={isPopupOpen}
          hide={handleClosePopup}
          targetTree={treeItem}
          handleAfterDelete={handleAfterDelete}
          handleClickCreate={handleClickCreate}
        />
      </TreeItem>
    </Box>
  )
}

export default RecursivTreeItem;