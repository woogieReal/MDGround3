import TreeSection from '@/components/tree/sections/treeSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Grid } from '@mui/material'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import styles from '@/styles/tree.module.css'

const MIN_DRAWER_WIDTH = 240;

const Home: NextPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handler = (mouseDownEvent: any) => {
    const startSize = drawerWidth;
    const startPosition = mouseDownEvent.pageX;

    function onMouseMove(mouseMoveEvent: any) {
      setDrawerWidth(currentSize => (startSize - startPosition + mouseMoveEvent.pageX));
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
      sx={{ display: 'flex' }}
    >
      <TreeSection
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerClose={handleDrawerClose}
      />
      {open && <Button id={styles.resizeButton} onMouseDown={handler} />}
      <ViewSection
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerOpen={handleDrawerOpen}
      />
    </Box>
  )
}

export default Home
