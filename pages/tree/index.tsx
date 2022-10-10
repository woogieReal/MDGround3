import TreeSection from '@/components/tree/sections/treeSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Tabs, Tab, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '@/styles/tree.module.scss'
import MenuIcon from '@mui/icons-material/Menu';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TabPanel from '@/components/common/atoms/tabPanel'

const MIN_DRAWER_WIDTH = 240;

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);
  const [tabVaue, setTabVaue] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabVaue(newValue);
  };

  const handleDrawerShow = () => {
    setOpen(!open);
  };

  const handler = (mouseDownEvent: any) => {
    const startSize = drawerWidth;
    const startPosition = mouseDownEvent.pageX;

    const onMouseMove = (mouseMoveEvent: any) => {
      setDrawerWidth(startSize - startPosition + mouseMoveEvent.pageX);
    }
    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabVaue}
        onChange={handleTabChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible', width: styles.verticalTabWidthPX }}
      >
        <Tab icon={<MenuIcon />} {...a11yProps(0)} onClick={() => tabVaue === 0 && handleDrawerShow()} />
        <Tab icon={<SearchOutlinedIcon />} {...a11yProps(1)} />
      </Tabs>
      <TreeSection
        open={open}
        drawerWidth={drawerWidth}
      />
      {open && <Button id={styles.resizeButton} onMouseDown={handler} />}
      <TabPanel value={tabVaue} index={0}>
        <ViewSection
          open={open}
          drawerWidth={drawerWidth}
        />
      </TabPanel>
      <TabPanel value={tabVaue} index={1}>
        <ViewSection
          open={open}
          drawerWidth={drawerWidth}
        />
      </TabPanel>
    </Box>
  )
}

export default Home
