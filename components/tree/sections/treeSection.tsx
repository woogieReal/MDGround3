import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DrawerHeader from '@/components/tree/modules/drawerHeader';
import { MouseEventHandler, useState } from 'react';
import styles from '@/styles/tree.module.css'
import mockData from '@/tests/tree/mockData';
import { ResTree } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  open: boolean;
  drawerWidth: number;
  handleDrawerClose: MouseEventHandler;
}
const TreeSection = ({ open, drawerWidth, handleDrawerClose }: Props) => {
  const theme = useTheme();

  return (
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
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          woogieReal
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
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
  )
}

export default TreeSection;