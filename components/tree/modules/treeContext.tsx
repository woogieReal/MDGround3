import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import { MultiTreeCutOrCopy, TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from "@/src/models/tree.model";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";
import { useEffect, useState } from "react";
import { validateCutOrCopyTree, validateDeleteTree } from "@/src/utils/tree/treeValidation";
import { ValidationResponse } from "@/src/models/validation.model";
import { createInitialMultiTreeRequest, createInitialTree, createTreeFullPath } from "@/src/utils/tree/treeUtil";
import { checkInitalRootTree } from "@/src/utils/tree/treeCheck";
import { TreeContextType, useTreeContextType } from "./utils/treeContext";
import _ from 'lodash';

const iconStyle = { marginRight: '10px' };

interface Props {
  anchorEl: HTMLElement | null;
  isShow: boolean;
  hide(): void;
  targetTree: Tree
  targetTreeList: Tree[],
  mousePosition: { left: number, top: number };
  clickCreate(tree: Tree): void;
  clickRename(tree: Tree): void;
  afterDelete(treeList: Tree[]): void;
  afterCut(toTree: Tree, treeList: Tree[]): void;
}
const TreeContext = ({ anchorEl, isShow, hide, targetTree, targetTreeList, mousePosition, afterDelete, clickCreate, clickRename, afterCut }: Props) => {
  const multiSelectedTreeId = _.map(targetTreeList, 'treeId');
  const contextType: TreeContextType = useTreeContextType(targetTree, multiSelectedTreeId);

  const multiTargetTree: Tree[] = targetTreeList.length > 0 ? targetTreeList : [targetTree];

  const [deleteTargetTreeList, setDeleteTargetTreeList] = useState<Tree[]>([]);
  const [isReadyToDelete, setIsReadyToDelete] = useState<boolean>(false);

  const [cutOrCopy, setCutOrCopy] = useState<'cut' | 'copy' | undefined>(undefined);
  const [cutOrCopyTargetTreeList, setCutOrCopyTargetTreeList] = useState<Tree[]>([]);
  const [cutOrCopyTree, setCutOrCopyTree] = useState<MultiTreeCutOrCopy>(createInitialMultiTreeRequest());
  const [isReadyToCutOrCopy, setIsReadyToCutOrCopy] = useState<boolean>(false);
  const clearCutOrCopyState = () => {
    setCutOrCopy(undefined);
    setCutOrCopyTargetTreeList([]);
    setCutOrCopyTree(createInitialMultiTreeRequest());
    setIsReadyToCutOrCopy(false);
  }

  const deleteTree = useMutation(async () => await ApiHandler.callApi(ApiName.DELETE_TREE, null, deleteTargetTreeList), {
    onSuccess(res: AxiosResponse) {
      afterDelete(deleteTargetTreeList);
      setIsReadyToDelete(false);
    },
  });

  const cutTree = useMutation(async () => await ApiHandler.callApi(ApiName.CUT_TREE, null, cutOrCopyTree), {
    onSuccess(res: AxiosResponse) {
      const { toTree, targetTreeList } = cutOrCopyTree;
      afterCut(toTree, targetTreeList);
      clearCutOrCopyState();
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
    clickRename({ ...targetTree, treeStatus: TreeStatusInfo.RENAME });
    hide();
  }

  const handlClickDelte = () => {
    hide();
    checkReadyToDelete();
  }

  const checkReadyToDelete = () => {
    const response = validateDeleteTree(multiTargetTree);
    setDeleteTargetTreeList(response.processedData);
    setIsReadyToDelete(response.isValid);
  }

  useEffect(() => {
    isReadyToDelete && deleteTree.mutate();
  }, [isReadyToDelete])

  const handlClickCut = () => {
    setCutOrCopyTargetTreeList(multiTargetTree);
    setCutOrCopy('cut');
    hide();
  }

  const handlClickPaste = () => {
    hide();
    checkReadyToCutOrCopy();
  }

  const checkReadyToCutOrCopy = () => {
    const validationRequest: MultiTreeCutOrCopy = {
      toTree: targetTree,
      targetTreeList: cutOrCopyTargetTreeList,
    }
    const response = validateCutOrCopyTree(validationRequest);
    setCutOrCopyTree(response.processedData);
    setIsReadyToCutOrCopy(response.isValid);
  }

  useEffect(() => {
    if (isReadyToCutOrCopy) {
      cutOrCopy === 'cut' ? cutTree.mutate() : () => {}
    }
  }, [isReadyToCutOrCopy])

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

  const renderCutTree = () => {
    return (
      <ListItem disablePadding onClick={handlClickCut} >
        <ListItemButton>
          <ContentCutOutlinedIcon sx={iconStyle} />
          <ListItemText primary="cut" />
        </ListItemButton>
      </ListItem>
    )
  }

  const renderPasteTree = () => {
    return (
      <ListItem disablePadding onClick={handlClickPaste} >
        <ListItemButton disabled={cutOrCopyTargetTreeList.length === 0} >
          <FolderCopyOutlinedIcon sx={iconStyle} />
          <ListItemText primary="paste" />
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
              {
                {
                  'folder': (
                    <>
                      {renderCreateFile()}
                      {renderCreateForder()}
                      {renderRenameTree()}
                      {renderDeleteTree()}
                      {renderCutTree()}
                      {renderPasteTree()}
                    </>
                  ),
                  'file': (
                    <>
                      {renderRenameTree()}
                      {renderDeleteTree()}
                      {renderCutTree()}
                    </>
                  ),
                  'multiSelect': (
                    <>
                      {renderDeleteTree()}
                      {renderCutTree()}
                    </>
                  ),
                  'root': (
                    <>
                      {renderCreateFile()}
                      {renderCreateForder()}  
                      {renderPasteTree()}
                    </>
                  )
                }[contextType]
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