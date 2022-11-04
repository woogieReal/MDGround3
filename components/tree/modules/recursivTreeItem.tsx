import { InitialTree, TEST_USER_ID, Tree, TreeType } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'
import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { ValidationResponse } from "@/src/models/validation.model";
import { validateCreateTree } from "@/src/scripts/tree/validation";
import { AxiosResponse } from "axios";
import { isEnter } from "@/src/scripts/common/keyPress";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";

const iconStyle = { marginRight: '10px' };

interface Props {
  data: Tree;
  depth: number;
  fetchDatas: Function;
  onClickHandler: Function;
  onDoubleClickHandler: Function;
}
const RecursivTreeItem = ({ data, depth, fetchDatas, onClickHandler, onDoubleClickHandler }: Props) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const treeFullPath = data.treePath ? data.treePath + '|' + data.treeId : String(data.treeId);

  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [newTreeInputOpen, setNewTreeInputOpen] = useState<boolean>(false);
  const [newTree, setNewTree] = useState<Tree>(InitialTree);
  const [isReadyToCreate, setIsReadyToCreate] = useState<boolean>(false);
  const [isInputed, setIsInputed] = useState<boolean>(false);

  const hasChildren = data.treeChildren?.length! > 0 ? true : false;

  const createTree = useMutation(async () => await ApiHandler.callApi(ApiName.CREATE_TREE, null, { ...newTree, userId: TEST_USER_ID }), {
    onSuccess(res: AxiosResponse) {
      setNewTreeInputOpen(false);
      setNewTree(InitialTree);
      setIsReadyToCreate(false);
      setIsInputed(false);
      fetchDatas();
    },
  });

  const deleteTree = useMutation(async () => await ApiHandler.callApi(ApiName.DELETE_TREE, null, { userId: TEST_USER_ID }, data.treeId), {
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

  // 생성
  const handleClickCreate = (treeType: TreeType) => {
    setNewTreeInputOpen(true);
    setNewTree({ ...newTree, treeType, treePath: treeFullPath });
    setAnchorEl(null);
  }

  const handlBlurNewTreeInput = () => {
    isInputed && checkReadyToCreate();
  }

  const handleChangeNewTreeInput = (e: React.BaseSyntheticEvent) => {
    !isInputed && setIsInputed(true);
    setNewTree({ ...newTree, treeName: e.target.value });
  }

  const handleKeyPressNewTreeInput = (e: any) => {
    isEnter(e) && checkReadyToCreate();
  }

  const checkReadyToCreate = () => {
    const response: ValidationResponse = validateCreateTree(newTree);
    setNewTree(response.processedData);
    setIsReadyToCreate(response.isValid);
  }
  // -- 생성

  // 삭제
  const handlClickDelte = () => {
    setAnchorEl(null);
    deleteTree.mutate();
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  useEffect(() => {
    newTreeInputOpen && inputEl.current?.focus();
  }, [newTreeInputOpen])

  useEffect(() => {
    isReadyToCreate && createTree.mutate();
  }, [isReadyToCreate])

  return (
    <Box>
      <TreeItem
        id={String(data.treeId)}
        nodeId={String(data.treeId)}
        label={data.treeName}
        className={styles.treeItem}
        icon={data.treeType === TreeType.FORDER ? <FolderOutlinedIcon /> : <DescriptionOutlinedIcon />}
        onClick={() => onClickHandler(data)}
        onDoubleClick={() => onDoubleClickHandler(data)}
        onContextMenu={handleContextMenu}
      >
        {hasChildren && data.treeChildren?.map((item: Tree) => (
          <RecursivTreeItem
            key={item.treeId}
            data={item}
            depth={depth + 1}
            fetchDatas={fetchDatas}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
          />
        ))}
        {newTreeInputOpen &&
          <Box>
            {newTree.treeType === TreeType.FORDER ? <FolderOutlinedIcon className={styles.newTreeInputIcon} /> : <DescriptionOutlinedIcon className={styles.newTreeInputIcon} />}
            <input
              ref={inputEl}
              id={styles.newTreeInput}
              type='text'
              value={newTree.treeName}
              onBlur={handlBlurNewTreeInput}
              onChange={handleChangeNewTreeInput}
              onKeyUp={handleKeyPressNewTreeInput}
            />
          </Box>
        }
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
        <Box>
          <List>
            {data.treeType === TreeType.FORDER &&
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
      <LodingBackDrop isOpen={createTree.isLoading} />
    </Box>
  )
}

export default RecursivTreeItem;