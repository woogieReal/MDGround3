import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DrawerHeader from '@/components/tree/modules/drawerHeader';
import { MouseEventHandler } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from '@/styles/tree.module.css'
import mockData from '@/tests/tree/mockData';
import { ResTree } from '@/src/models/tree.model';
import RecursiveButton from '../modules/recursiveButton';
import { Box } from '@mui/material';

interface Props {
  open: boolean;
  drawerWidth: number;
  setDrawerWidth: Function;
  handleDrawerClose: MouseEventHandler;
}
const TreeSection = ({ open, drawerWidth, setDrawerWidth, handleDrawerClose }: Props) => {
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
      <DndProvider backend={HTML5Backend}>
        <Box id={styles.recursiveTreeSection}>
          {mockData.map((data: ResTree, index) => (
            <RecursiveButton key={`${index}-${data.treeId}`} data={data} index={index} />
          ))}
        </Box>
      </DndProvider>
    </Drawer>
  )
}

export default TreeSection;