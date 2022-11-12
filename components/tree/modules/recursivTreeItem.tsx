import { Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box } from "@mui/material";
import { useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TreeNameInput from '@/components/tree/modules/treeNameInput';

interface Props {
  data: Tree;
  depth: number;
  handleClickItem: Function;
  handleDoubleClickItem: Function;
  handleContextMenu: (e: React.BaseSyntheticEvent, targetTree?: Tree) => void;
}
const RecursivTreeItem = ({ data, depth, handleClickItem, handleDoubleClickItem, handleContextMenu }: Props) => {
  const [tree, setTree] = useState<Tree>(data);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  const hasChildren = tree.treeChildren?.length! > 0 ? true : false;

  const handleAfterCreate = (upperTree: Tree) => {
    setIsOpenNewTree(false);
    setTree(upperTree);
  }

  return (
    <Box>
      <TreeItem
        id={String(tree.treeId)}
        nodeId={String(tree.treeId)}
        label={tree.treeName}
        className={styles.treeItem}
        icon={tree.treeType === TreeType.FORDER ? <FolderOutlinedIcon /> : <DescriptionOutlinedIcon />}
        onClick={() => handleClickItem(tree)}
        onDoubleClick={() => handleDoubleClickItem(tree)}
        onContextMenu={(e: React.BaseSyntheticEvent) => handleContextMenu(e, tree)}
      >
        {hasChildren && tree.treeChildren?.map((item: Tree) => (
          <RecursivTreeItem
            key={item.treeId}
            data={item}
            depth={depth + 1}
            handleClickItem={handleClickItem}
            handleDoubleClickItem={handleDoubleClickItem}
            handleContextMenu={handleContextMenu}
          />
        ))}
        <TreeNameInput
          isShow={isOpenNewTree}
          uppertree={tree}
          treeType={newTreeType}
          handleAfterCreate={handleAfterCreate}
        />
      </TreeItem>
    </Box>
  )
}

export default RecursivTreeItem;