import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/tree.module.scss'
import { ResTrees } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiHandler from '@/src/apis/apiHandler';


interface Props {
  open: boolean;
  drawerWidth: number;
}
const TreeSection = ({ open, drawerWidth }: Props) => {
  const [trees, setTrees] = useState<ResTrees[]>([]);
  const getTrees: UseQueryResult = useQuery([ApiName.GET_TREES], async () => await ApiHandler.callApi(ApiName.GET_TREES), {
    onSuccess(res: AxiosResponse) {
      setTrees(res.data);
    },
  });

  const getTree: UseQueryResult = useQuery([ApiName.GET_TREE], async () => await ApiHandler.callApi(ApiName.GET_TREE, null, null, 77), {
    onSuccess(res: AxiosResponse) {
      console.log(res);
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
        <Box id={styles.resizableDrawerHeader}>

        </Box>
        <Divider />
        <TreeView
          aria-label="multi-select"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
          sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          {trees.map((data: ResTrees, index: number) => (
            <RecursivTreeItem key={`${index}-${data.treeId}`} data={data} depth={1} />
          ))}
        </TreeView>
      </Drawer>
    </Box>
  )
}

export default TreeSection;