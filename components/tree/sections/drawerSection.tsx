import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/tree.module.scss'
import { Tree, TreeType, initialFileTree, TEST_USER_ID } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiHandler from '@/src/apis/apiHandler';
import { CommonQueryOptions } from '@/src/apis/reactQuery';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';

interface Props {
  open: boolean;
  drawerWidth: number;
  verticalTabVaue: number;
  handleTreeClick: Function;
  handleTreeDoubleClick: Function;
}
const DrawerSection = ({ open, drawerWidth, verticalTabVaue, handleTreeClick, handleTreeDoubleClick }: Props) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES, { userId: TEST_USER_ID }), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      setTrees(res.data);
    },
  });

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
              fetchDatas={getTrees.refetch}
              handleClickItem={handleTreeClick}
              handleDoubleClickItem={handleTreeDoubleClick}
            />
          ))}
        </TreeView>
      </Drawer>
      <LodingBackDrop isOpen={getTrees.isLoading} />
    </Box>
  )
}

export default DrawerSection;