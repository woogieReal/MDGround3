import { InitialTree, Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeNameInput from '@/components/tree/modules/treeNameInput';
import TreeContext from '@/components/tree/modules/treeContext';
import { deleteTreeFromTrees } from "@/src/utils/tree/treeUtil";

interface Props {
  data: Tree;
  setTrees: Dispatch<SetStateAction<Tree[]>>
  handleTreeClick(data: Tree): void;
  handleTreeDoubleClick(data: Tree): void;
}
const RecursivTreeItem = ({ data, setTrees, handleTreeClick, handleTreeDoubleClick }: Props) => {
  const [tree, setTree] = useState<Tree | null>(data);

  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  const hasChildren = tree && tree.treeChildren?.length! > 0 ? true : false;

  const handleContextMenu = (e: React.BaseSyntheticEvent, targetTree?: Tree) => {
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

  const handleAfterCreate = (newTree: Tree, upperTree: Tree) => {
    setIsOpenNewTree(false);
    setTree(upperTree);
    handleTreeDoubleClick(newTree);
  }

  const handleAfterDelete = (deletedTree: Tree) => {
    setTrees((currTrees: Tree[]) => deleteTreeFromTrees(currTrees, deletedTree));
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  return (
    <Box>
      {tree &&
        <TreeItem
          id={String(tree.treeId)}
          nodeId={String(tree.treeId)}
          label={tree.treeName}
          className={styles.treeItem}
          icon={tree.treeType === TreeType.FORDER ? <FolderOutlinedIcon /> : <DescriptionOutlinedIcon />}
          onClick={() => handleTreeClick(tree)}
          onDoubleClick={() => handleTreeDoubleClick(tree)}
          onContextMenu={(e: React.BaseSyntheticEvent) => handleContextMenu(e, tree)}
        >
          {hasChildren && tree.treeChildren?.map((item: Tree) => (
            <RecursivTreeItem
              key={item.treeId}
              data={item}
              setTrees={setTrees}
              handleTreeClick={handleTreeClick}
              handleTreeDoubleClick={handleTreeDoubleClick}
            />
          ))}
          <TreeNameInput
            isShow={isOpenNewTree}
            uppertree={tree}
            treeType={newTreeType}
            handleAfterCreate={handleAfterCreate}
          />
          <TreeContext
            anchorEl={anchorEl}
            isShow={isPopupOpen}
            hide={handleClosePopup}
            targetTree={tree}
            handleAfterDelete={handleAfterDelete}
            handleClickCreate={handleClickCreate}
          />
        </TreeItem>
      }
    </Box>
  )
}

export default RecursivTreeItem;