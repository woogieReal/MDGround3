import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/tree.module.scss'
import mockData from '@/tests/tree/mockData';
import { ResTree } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';

interface Props {
  open: boolean;
  drawerWidth: number;
}
const TreeSection = ({ open, drawerWidth }: Props) => {

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
          {mockData.map((data: ResTree, index) => (
            <RecursivTreeItem key={`${index}-${data.treeId}`} data={data} depth={1} />
          ))}
        </TreeView>
      </Drawer>
    </Box>
  )
}

export default TreeSection;