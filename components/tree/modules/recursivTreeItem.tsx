import { TEST_USER_ID, Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import { useEffect, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";
import TreeNameInput from '@/components/tree/modules/treeNameInput';

const iconStyle = { marginRight: '10px' };

interface Props {
  data: Tree;
  depth: number;
  fetchDatas: Function;
  handleClickItem: Function;
  onDoubleClickHandler: Function;
}
const RecursivTreeItem = ({ data, depth, fetchDatas, handleClickItem, onDoubleClickHandler }: Props) => {
  const [tree, setTree] = useState<Tree>(data);

  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  const hasChildren = tree.treeChildren?.length! > 0 ? true : false;

  const deleteTree = useMutation(async () => await ApiHandler.callApi(ApiName.DELETE_TREE, null, { userId: TEST_USER_ID }, tree.treeId), {
    onSuccess(res: AxiosResponse) {
      fetchDatas();
    },
  });

  const handleContextMenu = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const handleAfterCreate = (upperTree: Tree) => {
    setIsOpenNewTree(false);
    setTree(upperTree);
  }

  const handleClickCreate = (treeType: TreeType) => {
    setIsOpenNewTree(true);
    setNewTreeType(treeType);
    setAnchorEl(null);
  }

  const handlClickDelte = () => {
    setAnchorEl(null);
    deleteTree.mutate();
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  return (
    <Box>
      <TreeItem
        id={String(tree.treeId)}
        nodeId={String(tree.treeId)}
        label={tree.treeName}
        className={styles.treeItem}
        icon={tree.treeType === TreeType.FORDER ? <FolderOutlinedIcon /> : <DescriptionOutlinedIcon />}
        onClick={() => handleClickItem(tree)}
        onDoubleClick={() => onDoubleClickHandler(tree)}
        onContextMenu={handleContextMenu}
      >
        {hasChildren && tree.treeChildren?.map((item: Tree) => (
          <RecursivTreeItem
            key={item.treeId}
            data={item}
            depth={depth + 1}
            fetchDatas={fetchDatas}
            handleClickItem={handleClickItem}
            onDoubleClickHandler={onDoubleClickHandler}
          />
        ))}
        <TreeNameInput
          isShow={isOpenNewTree}
          uppertree={tree}
          treeType={newTreeType}
          handleAfterCreate={handleAfterCreate}
        />
      </TreeItem>
      <Popover
        id={String(tree.treeId)}
        open={isPopupOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box>
          <List>
            {tree.treeType === TreeType.FORDER &&
              <>
                <ListItem disablePadding onClick={() => handleClickCreate(TreeType.FILE)}>
                  <ListItemButton>
                    <AddBoxOutlinedIcon sx={iconStyle} />
                    <ListItemText primary="New File" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={() => handleClickCreate(TreeType.FORDER)}>
                  <ListItemButton>
                    <AddBoxOutlinedIcon sx={iconStyle} />
                    <ListItemText primary="New Folder" />
                  </ListItemButton>
                </ListItem>
              </>
            }
            <ListItem disablePadding onClick={() => handlClickDelte()} >
              <ListItemButton>
                <DeleteOutlineOutlinedIcon sx={iconStyle} />
                <ListItemText primary="delete" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>
      <LodingBackDrop isOpen={deleteTree.isLoading} />
    </Box>
  )
}

export default RecursivTreeItem;