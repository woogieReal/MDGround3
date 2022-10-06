import TreeSection from '@/components/tree/sections/treeSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Grid } from '@mui/material'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'

const MIN_DRAWER_WIDTH = 240;

const Home: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TreeSection
        open={open}
        drawerWidth={drawerWidth}
        setDrawerWidth={setDrawerWidth}
        handleDrawerClose={handleDrawerClose}
      />
      <ViewSection
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerOpen={handleDrawerOpen}
      />
    </Box>
  )
}

export default Home
