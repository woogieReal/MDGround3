import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/tree.module.scss'
import mockData from '@/tests/tree/mockData';
import { ResTree } from '@/src/models/tree.model';
import RecursivTreeItem from '../modules/recursivTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DrawerHeader from '@/components/tree/modules/drawerHeader';
import { MouseEventHandler } from 'react';

interface Props {
  open: boolean;
  drawerWidth: number;
  setDrawerWidth: Function;
  handleDrawerShow: MouseEventHandler;
}
const TreeSection = ({ open, drawerWidth, setDrawerWidth, handleDrawerShow }: Props) => {
  const theme = useTheme();

  const handler = (mouseDownEvent: any) => {
    const startSize = drawerWidth;
    const startPosition = mouseDownEvent.pageX;

    function onMouseMove(mouseMoveEvent: any) {
      setDrawerWidth(startSize - startPosition + mouseMoveEvent.pageX);
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <Box
      id={styles.resizableContainer}
    >
      <Drawer
        id={styles.resizableDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          // left: `${Number(styles.verticalTabWidth) || 0}px`,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            // left: `${Number(styles.verticalTabWidth) || 0}px`,
          },
        }}
        variant="persistent"
        anchor="left"
        transitionDuration={0}
        open={open}
      >
        <DrawerHeader id={styles.resizableDrawerHeader}>

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
        <Button id={styles.resizeButton} onMouseDown={handler} />
      </Drawer>
    </Box>
  )
}

export default TreeSection;