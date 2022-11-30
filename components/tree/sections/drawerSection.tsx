import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import styles from '@/styles/tree.module.scss'
import { Tree, TreeType, TEST_USER_ID, InitialTree, MethodTypeForRecursivTreeItem } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import { Box } from '@mui/material';
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiHandler from '@/src/apis/apiHandler';
import { CommonQueryOptions } from '@/src/apis/reactQuery';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';
import TreeNameInput from '@/components/tree/modules/treeNameInput';
import TreeContext from '@/components/tree/modules/treeContext';
import { addTreeToTrees, changeStatusReRenderFromRootToNode, checkInitalTree, createTreeStructure, getTreeChildrenNames } from '@/src/utils/tree/treeUtil';
import _ from "lodash";

interface Props {
  open: boolean;
  drawerWidth: number;
  verticalTabVaue: number;
  handleTreeClick(data: Tree): void;
  handleTreeDoubleClick(data: Tree): void;
  deleteTabByTreeId(data: Tree): void;
}
const DrawerSection = ({ open, drawerWidth, verticalTabVaue, handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId }: Props) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [sameDepthTreeNames, setSameDepthTreeNames] = useState<Map<TreeType, string[]>>(new Map());

  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  // RecursivTreeItem의 메소드 호출 타입
  // handleTreeClick, handleTreeDoubleClick, deleteTabByTreeId를 props로 직접 내려주면 성능이슈 발생
  const [methodType, setMethodType] = useState<MethodTypeForRecursivTreeItem>(MethodTypeForRecursivTreeItem.DEFAULT);
  const [methodTargetTree, setMethodTargetTree] = useState<Tree>(InitialTree);

  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES, { userId: TEST_USER_ID }), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      setTrees(createTreeStructure(res.data));
      setSameDepthTreeNames(getTreeChildrenNames(res.data));
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

  const handleClickCreate = (treeType: TreeType) => {
    setIsOpenNewTree(true);
    setNewTreeType(treeType);
    setAnchorEl(null);
  }

  const handleAfterCreate = (newTree: Tree) => {
    setIsOpenNewTree(false);
    setTrees((currTrees: Tree[]) => addTreeToTrees(currTrees, newTree));
    handleTreeDoubleClick(newTree);
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

  useEffect(() => {
    if (!checkInitalTree(methodTargetTree)) {
      switch (methodType) {
        case MethodTypeForRecursivTreeItem.CREATE:
          const changedTrees = addTreeToTrees(trees, methodTargetTree, false);
          setTrees(changeStatusReRenderFromRootToNode(changedTrees, methodTargetTree, false));
          handleTreeDoubleClick(methodTargetTree);
          break;
        case MethodTypeForRecursivTreeItem.CLICK: handleTreeClick(methodTargetTree); break;
        case MethodTypeForRecursivTreeItem.DOUBLE_CLICK: handleTreeDoubleClick(methodTargetTree); break;
        case MethodTypeForRecursivTreeItem.DELETE_TAB: deleteTabByTreeId(methodTargetTree); break;
      }
    }
  }, [methodType, methodTargetTree])

  return (
    <Box
      id={styles.resizableContainer}
    >
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
        onContextMenu={handleContextMenu}
      >
        <Box sx={{ height: styles.appHeaderHeightPX }}>

        </Box>
        <Divider />
        <Box id={styles.treeSection}>
          {trees.map((data: Tree, index: number) => (
            <RecursivTreeItem
              key={`${index}-${data.treeId}`}
              treeItem={data}
              sameDepthTreeNames={sameDepthTreeNames}
              setTrees={setTrees}
              setMethodType={setMethodType}
              setMethodTargetTree={setMethodTargetTree}
            />
          ))}
        </Box>
        <TreeContext
          anchorEl={anchorEl}
          isShow={isPopupOpen}
          hide={handleClosePopup}
          handleClickCreate={handleClickCreate}
        />
      </Drawer>
      <LodingBackDrop isOpen={getTrees.isLoading} />
    </Box>
  )
}

export default DrawerSection;