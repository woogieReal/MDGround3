import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { TEST_USER_ID, Tree, TreeType } from "@/src/models/tree.model";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";
import { useEffect, useState } from "react";
import { validateDeleteTree } from "@/src/utils/tree/validation";
import { ValidationResponse } from "@/src/models/validation.model";

const iconStyle = { marginRight: '10px' };

interface Props {
  anchorEl: HTMLElement | null;
  isShow: boolean;
  hide(): void;
  targetTree?: Tree
  setTargetTree?(targetTree: Tree | null): void;
  handleClickCreate(treeType: TreeType): void;
}
const TreeContext = ({ anchorEl, isShow, hide, targetTree, setTargetTree, handleClickCreate }: Props) => {
  const [deleteTargetTree, setDeleteTargetTree] = useState<Tree>();
  const [isReadyToDelete, setIsReadyToDelete] = useState<boolean>(false);

  const deleteTree = useMutation(async () => await ApiHandler.callApi(ApiName.DELETE_TREE, null, { ...deleteTargetTree, userId: TEST_USER_ID }, deleteTargetTree?.treeId!), {
    onSuccess(res: AxiosResponse) {
      setTargetTree && setTargetTree(null);
    },
  });

  const handlClickDelte = () => {
    hide();
    checkReadyToDelete();
  }

  const checkReadyToDelete = () => {
    const response: ValidationResponse = validateDeleteTree(targetTree!);
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

  const renderDeleteTree = () => {
    return (
      <ListItem disablePadding onClick={() => handlClickDelte()} >
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
          anchorEl={anchorEl}
          onClose={hide}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box>
            <List>
              {targetTree ?
                <>
                  {
                    targetTree.treeType === TreeType.FORDER ?
                      <>
                        {renderCreateFile()}
                        {renderCreateForder()}
                        {renderDeleteTree()}
                      </>
                      :
                      renderDeleteTree()
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