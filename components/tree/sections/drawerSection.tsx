import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/tree.module.scss'
import { Tree, TreeType, TEST_USER_ID, InitialTree } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiHandler from '@/src/apis/apiHandler';
import { CommonQueryOptions } from '@/src/apis/reactQuery';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';
import TreeNameInput from '@/components/tree/modules/treeNameInput';
import TreeContext from '@/components/tree/modules/treeContext';

const iconStyle = { marginRight: '10px' };

interface Props {
  open: boolean;
  drawerWidth: number;
  verticalTabVaue: number;
  handleTreeClick: Function;
  handleTreeDoubleClick: Function;
}
const DrawerSection = ({ open, drawerWidth, verticalTabVaue, handleTreeClick, handleTreeDoubleClick }: Props) => {
  const [trees, setTrees] = useState<Tree[]>([]);

  // 트리 우클릭 팝업
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // 새로운 트리 생성
  const [isOpenNewTree, setIsOpenNewTree] = useState<boolean>(false);
  const [newTreeType, setNewTreeType] = useState<TreeType>(TreeType.FILE);

  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES, { userId: TEST_USER_ID }), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      setTrees(res.data);
    },
  });

  const handleContextMenu = (e: React.BaseSyntheticEvent, targetTree?: Tree) => {
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

  const handleAfterCreate = (upperTree: Tree) => {
    setIsOpenNewTree(false);
    const currentTrees = trees || [];
    currentTrees.push(upperTree);
    setTrees(currentTrees);
  }

  useEffect(() => {
    setIsPopupOpen(Boolean(anchorEl));
  }, [anchorEl])

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
        <TreeView
          aria-label="multi-select"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
          sx={{
            height: 216,
            flexGrow: 1,
            overflowY: 'auto',
            display: verticalTabVaue === 0 ? 'block' : 'none'
          }}
        >
          {trees.map((data: Tree, index: number) => (
            <RecursivTreeItem
              key={`${index}-${data.treeId}`}
              data={data}
              depth={1}
              handleClickItem={handleTreeClick}
              handleDoubleClickItem={handleTreeDoubleClick}
            />
          ))}
          <TreeNameInput
            isShow={isOpenNewTree}
            treeType={newTreeType}
            handleAfterCreate={handleAfterCreate}
          />
        </TreeView>
      </Drawer>
      <TreeContext
        anchorEl={anchorEl}
        isShow={isPopupOpen}
        hide={handleClosePopup}
        handleClickCreate={handleClickCreate}
      />
      <LodingBackDrop isOpen={getTrees.isLoading} />
    </Box>
  )
}

export default DrawerSection;