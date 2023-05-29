import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import styles from '@/styles/tree.module.scss'
import { Tree, TreeType, TEST_USER_ID, RecursivTreeEvent, RecursivTreeContextEventType, RecursivTreeTargetEventType, RecursivTreeEventGroup } from '@/src/models/tree.model';
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
import { getTreeChildrenNames, createInitialRootTree } from '@/src/utils/tree/treeUtil';
import { cloneDeep } from "lodash";
import React from "react";
import { checkInitalRootTree } from '@/src/utils/tree/treeCheck';
import { addTreeToUpper, replaceTreeFromUpper, removeTreeFromUpper } from '@/src/utils/tree/treeCRUD';
import { createTreeStructureFromTrees } from '@/src/utils/tree/treeStructure';
import _ from 'lodash';

interface Props {
  open: boolean;
  drawerWidth: number;
  setFiles: Dispatch<SetStateAction<Tree[]>>;
  handleTreeClick(data: Tree): void;
  handleTreeDoubleClick(data: Tree): void;
  deleteTabByTreeId(data: Tree): void;
}
const DrawerSection = ({ open, drawerWidth, setFiles, handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId }: Props) => {
  const [rootTree, setRootTree] = useState<Tree>(createInitialRootTree());

  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES, { userId: TEST_USER_ID }), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      setRootTree(createTreeStructureFromTrees(res.data));
    },
  });

  // RecursivTreeItem의 메소드 호출 타입
  // handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId를 props로 직접 내려주면 성능이슈 발생
  const [methodType, setMethodType] = useState<RecursivTreeEvent>(['inactive', 'default']);
  const [methodTargetTree, setMethodTargetTree] = useState<Tree>(createInitialRootTree());

  const setMethod = (methodType: RecursivTreeEvent, methodTargetTree?: Tree) => {
    setMethodType(methodType);
    methodTargetTree && setMethodTargetTree(methodTargetTree);
  }

  // 트리명 중복여부 체크
  const [sameDepthTreeNames, setSameDepthTreeNames] = useState<Map<TreeType, string[]>>(new Map());

  useEffect(() => {
    setSameDepthTreeNames(getTreeChildrenNames(rootTree.treeChildren || []));
  }, [rootTree.treeChildren])

  // 컨텍스트
  const [contextEvent, setContextEvent] = useState<React.BaseSyntheticEvent<MouseEvent> | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ left: 0, top: 0 });

  const handleContextMenuForDrawer = (e: React.BaseSyntheticEvent<MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.target);
    setMethodTargetTree(createInitialRootTree());
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
    setRootTree(addTreeToUpper(rootTree, tree));
  }

  const clickRenameForContext = (tree: Tree) => {
    setRootTree(replaceTreeFromUpper(rootTree, tree));
  }

  const afterDeleteForContext = (deletedTree: Tree) => {
    setRootTree(removeTreeFromUpper(rootTree, deletedTree));
    setMethod(['target', 'deleteTab'], deletedTree);
  }
  // -- 컨텍스트

  const switchHandleRecursivTreeEvent: {
    [key in RecursivTreeEventGroup]: Function
  } = {
    ['inactive']: () => {},
    ['context']: (type: RecursivTreeContextEventType) => handleRecursivTreeEventForContext[type],
    ['target']: (type: RecursivTreeTargetEventType) => handleRecursivTreeEventForTarget[type],
  }

  const handleRecursivTreeEventForContext: {
    [key in RecursivTreeContextEventType]: () => void
  } = {
    ['openContext']: () => handleContextMenuForTreeItem(contextEvent!),
  }

  const handleRecursivTreeEventForTarget: {
    [key in RecursivTreeTargetEventType]: () => void
  } = {
    ['create']: () => {
      setRootTree(addTreeToUpper(rootTree, methodTargetTree));
      handleTreeDoubleClick(methodTargetTree);
    },
    ['rename']: () => {
      setRootTree(replaceTreeFromUpper(rootTree, methodTargetTree));
      setFiles((currFiles: Tree[]) => {
        const cloneFiles = cloneDeep(currFiles);
        const targetIndex = _.findIndex(cloneFiles, { 'treeId': methodTargetTree.treeId });
        cloneFiles[targetIndex].treeName = methodTargetTree.treeName;
        return cloneFiles;
      })      
    },
    ['click']: () => {
      handleTreeClick(methodTargetTree);
      setMethodTargetTree(createInitialRootTree());
    },
    ['doubleClick']: () => handleTreeDoubleClick(methodTargetTree),
    ['deleteTab']: () => deleteTabByTreeId(methodTargetTree),
  }

  useEffect(() => {
    if (!checkInitalRootTree(methodTargetTree)) {
      const [group, type] = methodType;
      switchHandleRecursivTreeEvent[group](type)();
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