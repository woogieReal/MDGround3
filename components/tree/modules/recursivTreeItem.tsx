import { Tree } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box, Popover, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  data: Tree;
  depth: number;
  onClickHandler: Function;
  onDoubleClickHandler: Function;
}
const RecursivTreeItem = ({ data, depth, onClickHandler, onDoubleClickHandler }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const hasChildren = data.treeChildren?.length! > 0 ? true : false;

  const handleContextMenu = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  return (
    <Box>
      <TreeItem
        id={String(data.treeId)}
        nodeId={String(data.treeId)}
        label={data.treeName}
        className={styles.treeItem}
        onClick={() => onClickHandler(data)}
        onDoubleClick={() => onDoubleClickHandler(data)}
        onContextMenu={handleContextMenu}
      >
        {hasChildren && data.treeChildren?.map((item: Tree, idx: number) => (
          <RecursivTreeItem key={item.treeId} data={item} depth={depth + 1} onClickHandler={onClickHandler} onDoubleClickHandler={onDoubleClickHandler} />
        ))}
      </TreeItem>
      <Popover
        id={String(data.treeId)}
        open={isPopupOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{data.treeName}</Typography>
      </Popover>
    </Box>
  )
}

export default RecursivTreeItem;