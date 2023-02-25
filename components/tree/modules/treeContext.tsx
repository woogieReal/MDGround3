import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";
import { useEffect, useState } from "react";
import { validateDeleteTree } from "@/src/utils/tree/treeValidation";
import { ValidationResponse } from "@/src/models/validation.model";
import { createInitialTree, createTreeFullPath } from "@/src/utils/tree/treeUtil";
import { checkInitalRootTree } from "@/src/utils/tree/treeCheck";

const iconStyle = { marginRight: '10px' };

interface Props {
  anchorEl: HTMLElement | null;
  isShow: boolean;
  hide(): void;
  targetTree: Tree
  mousePosition: { left: number, top: number };
  clickCreate(tree: Tree): void;
  clickRename(tree: Tree): void;
  afterDelete(tree: Tree): void;
}
const TreeContext = ({ anchorEl, isShow, hide, targetTree, mousePosition, afterDelete, clickCreate, clickRename }: Props) => {
  const [deleteTargetTree, setDeleteTargetTree] = useState<Tree>();
  const [isReadyToDelete, setIsReadyToDelete] = useState<boolean>(false);

  const deleteTree = useMutation(async () => await ApiHandler.callApi(ApiName.DELETE_TREE, null, { ...deleteTargetTree, userId: TEST_USER_ID }, deleteTargetTree?.treeId!), {
    onSuccess(res: AxiosResponse) {
      afterDelete(deleteTargetTree!);
      setIsReadyToDelete(false);
    },
  });

  const handleClickCreate = (treeType: TreeType) => {
    clickCreate({
      ...createInitialTree(),
      treeType: treeType,
      treePath: createTreeFullPath(targetTree),
      treeStatus: TreeStatusInfo.CREATE
    });
  }

  const handleClickRename = () => {
    clickRename({ ...targetTree!, treeStatus: TreeStatusInfo.RENAME });
    hide();
  }

  const handlClickDelte = () => {
    hide();
    checkReadyToDelete();
  }

  const checkReadyToDelete = () => {
    const response: ValidationResponse<Tree> = validateDeleteTree(targetTree!);
    setDeleteTargetTree(response.processedData);
    setIsReadyToDelete(response.isValid);
  }

  useEffect(() => {
    isReadyToDelete && deleteTree.mutate();
  }, [isReadyToDelete])

  const renderCreateFile = () => {
    return (
      <ListItem disablePadding onClick={() => handleClickCreate(TreeType.FILE)}>
        <ListItemButton>
          <AddBoxOutlinedIcon sx={iconStyle} />
          <ListItemText primary="New File" />
        </ListItemButton>
      </ListItem>
    )
  }

  const renderCreateForder = () => {
    return (
      <ListItem disablePadding onClick={() => handleClickCreate(TreeType.FORDER)}>
        <ListItemButton>
          <AddBoxOutlinedIcon sx={iconStyle} />
          <ListItemText primary="New Folder" />
        </ListItemButton>
      </ListItem>
    )
  }

  const renderRenameTree = () => {
    return (
      <ListItem disablePadding onClick={handleClickRename} >
        <ListItemButton>
          <ModeEditOutlineOutlinedIcon sx={iconStyle} />
          <ListItemText primary="rename" />
        </ListItemButton>
      </ListItem>
    )
  }

  const renderDeleteTree = () => {
    return (
      <ListItem disablePadding onClick={handlClickDelte} >
        <ListItemButton>
          <DeleteOutlineOutlinedIcon sx={iconStyle} />
          <ListItemText primary="delete" />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <>
      {anchorEl &&
        <Popover
          id={String(targetTree?.treeId)}
          open={isShow}
          anchorReference={!checkInitalRootTree(targetTree) ? "anchorEl" : "anchorPosition"}
          anchorPosition={{ left: mousePosition.left, top: mousePosition.top }}
          anchorEl={anchorEl}
          onClose={hide}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box>
            <List>
              {!checkInitalRootTree(targetTree) ?
                <>
                  {
                    targetTree.treeType === TreeType.FORDER ?
                      <>
                        {renderCreateFile()}
                        {renderCreateForder()}
                        {renderRenameTree()}
                        {renderDeleteTree()}
                      </>
                      :
                      <>
                        {renderRenameTree()}
                        {renderDeleteTree()}
                      </>
                  }
                </>
                :
                <>
                  {renderCreateFile()}
                  {renderCreateForder()}
                </>
              }
            </List>
          </Box>
          <LodingBackDrop isOpen={deleteTree.isLoading} />
        </Popover>
      }
    </>
  )
}

export default TreeContext;