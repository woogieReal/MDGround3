import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import styles from '@/styles/tree.module.scss'
import { Tree, TreeType, TEST_USER_ID, InitialTree, MethodTypeForRecursivTreeItem, TreeStatusInfo, RootTree } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import { Box } from '@mui/material';
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiHandler from '@/src/apis/apiHandler';
import { CommonQueryOptions } from '@/src/apis/reactQuery';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, changeTreeFromTrees, checkInitalTree, createTreeStructure, deleteTreeFromTrees, getTreeChildrenNames } from '@/src/utils/tree/treeUtil';
import { cloneDeep } from "lodash";
import React from "react";

interface Props {
  open: boolean;
  drawerWidth: number;
  setFiles: Dispatch<SetStateAction<Tree[]>>
  handleTreeClick(data: Tree): void;
  handleTreeDoubleClick(data: Tree): void;
  deleteTabByTreeId(data: Tree): void;
}
const DrawerSection = ({ open, drawerWidth, setFiles, handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId }: Props) => {
  const [rootTree, setRootTree] = useState<Tree>(RootTree);
  const [sameDepthTreeNames, setSameDepthTreeNames] = useState<Map<TreeType, string[]>>(new Map());

  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES, { userId: TEST_USER_ID }), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      setRootTree(createTreeStructure(res.data));
      setSameDepthTreeNames(getTreeChildrenNames(res.data));
    },
  });

  // RecursivTreeItem의 메소드 호출 타입
  // handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId를 props로 직접 내려주면 성능이슈 발생
  const [methodType, setMethodType] = useState<MethodTypeForRecursivTreeItem>(MethodTypeForRecursivTreeItem.DEFAULT);
  const [methodTargetTree, setMethodTargetTree] = useState<Tree>(InitialTree);

  const setMethod = (methodType: MethodTypeForRecursivTreeItem, methodTargetTree?: Tree) => {
    setMethodType(methodType);
    methodTargetTree && setMethodTargetTree(methodTargetTree);
  }

  // 컨텍스트
  const [contextEvent, setContextEvent] = useState<React.BaseSyntheticEvent<MouseEvent> | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ left: 0, top: 0 });

  const handleContextMenuForDrawer = (e: React.BaseSyntheticEvent<MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.target);
    setMethodTargetTree(InitialTree);
    setMousePosition({ left: e.nativeEvent.clientX, top: e.nativeEvent.clientY });
  }

  const handleContextMenuForTreeItem = (e: React.BaseSyntheticEvent<MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.target);
    setMousePosition({ left: 0, top: 0 });
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const clickCreateForContext = (tree: Tree) => {
    setAnchorEl(null);
    setRootTree(addTreeToTrees(rootTree, tree));
  }

  const clickRenameForContext = (tree: Tree) => {
    setRootTree(changeTreeFromTrees(rootTree, tree));
  }

  const afterDeleteForContext = (deletedTree: Tree) => {
    setRootTree((currRootTree: Tree) => deleteTreeFromTrees(currRootTree, deletedTree));
    setMethod(MethodTypeForRecursivTreeItem.DELETE_TAB, deletedTree);
  }
  // -- 컨텍스트

  useEffect(() => {
    if (!checkInitalTree(methodTargetTree)) {
      switch (methodType) {
        case MethodTypeForRecursivTreeItem.OPEN_CONTEXT:
          handleContextMenuForTreeItem(contextEvent!);
          break;
        case MethodTypeForRecursivTreeItem.CREATE:
          const isRootFolderTree = methodTargetTree.treePath === '' && methodTargetTree.treeType === TreeType.FORDER && methodTargetTree.treeStatus !== TreeStatusInfo.CREATE;
          setRootTree(addTreeToTrees(rootTree, methodTargetTree));
          handleTreeDoubleClick(methodTargetTree);
          break;
        case MethodTypeForRecursivTreeItem.RENAME:
          setRootTree(changeTreeFromTrees(rootTree, methodTargetTree));
          setFiles((currFiles: Tree[]) => {
            const cloneFiles = cloneDeep(currFiles);
            const targetIndex = cloneFiles.findIndex((file: Tree) => file.treeId === methodTargetTree.treeId);
            if (targetIndex >= 0) {
              cloneFiles[targetIndex].treeName = methodTargetTree.treeName;
            }
            return cloneFiles;
          })
          break;
        case MethodTypeForRecursivTreeItem.CLICK:
          handleTreeClick(methodTargetTree);
          setMethodTargetTree(InitialTree);
          break;
        case MethodTypeForRecursivTreeItem.DOUBLE_CLICK:
          handleTreeDoubleClick(methodTargetTree);
          break;
        case MethodTypeForRecursivTreeItem.DELETE_TAB:
          deleteTabByTreeId(methodTargetTree);
          break;
      }
    }
  }, [methodType, methodTargetTree, contextEvent])

  return (
    <Box id={styles.resizableContainer}>
      <Drawer
        id={styles.resizableDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        transitionDuration={0}
        open={open}
        onContextMenu={handleContextMenuForDrawer}
      >
        <Box sx={{ height: styles.appHeaderHeightPX }}>

        </Box>
        <Divider />
        <Box id={styles.treeSection}>
          {rootTree.treeChildren?.map((data: Tree, index: number) => (
            <RecursivTreeItem
              key={`${index}-${data.treeId}`}
              treeItem={data}
              sameDepthTreeNames={sameDepthTreeNames}
              setRootTree={setRootTree}
              setMethodType={setMethodType}
              setMethodTargetTree={setMethodTargetTree}
              setContextEvent={setContextEvent}
            />
          ))}
        </Box>
        <TreeContext
          anchorEl={anchorEl}
          isShow={Boolean(anchorEl)}
          hide={handleClosePopup}
          targetTree={methodTargetTree}
          mousePosition={mousePosition}
          clickCreate={clickCreateForContext}
          clickRename={clickRenameForContext}
          afterDelete={afterDeleteForContext}
        />
      </Drawer>
      <LodingBackDrop isOpen={getTrees.isLoading} />
    </Box>
  )
}

export default DrawerSection;