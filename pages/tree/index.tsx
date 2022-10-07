import TreeSection from '@/components/tree/sections/treeSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Grid, IconButton, Tabs, Tab, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import styles from '@/styles/tree.module.scss'
import MenuIcon from '@mui/icons-material/Menu';

const MIN_DRAWER_WIDTH = 240;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleDrawerShow = () => {
    setOpen(!open);
  };

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
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible' }}
      >
        <Tab icon={<MenuIcon />} {...a11yProps(0)} onClick={handleDrawerShow} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
      </Tabs>
      <TreeSection
        open={open}
        drawerWidth={drawerWidth}
        setDrawerWidth={setDrawerWidth}
        handleDrawerShow={handleDrawerShow}
      />
      {open && <Button id={styles.resizeButton} onMouseDown={handler} />}
      <ViewSection
        open={open}
        drawerWidth={drawerWidth}
      />
    </Box>
  )
}

export default Home
