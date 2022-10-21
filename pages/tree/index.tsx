import DrawerSection from '@/components/tree/sections/drawerSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Tabs, Tab, Typography, AppBar, Toolbar } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '@/styles/tree.module.scss'
import MenuIcon from '@mui/icons-material/Menu';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TabPanel from '@/components/common/atoms/tabPanel'
import { Tree, TreeType } from '@/src/models/tree.model'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo'
import ApiHandler from '@/src/apis/apiHandler'
import { AxiosResponse } from 'axios'
import { useEffect } from 'react'

const MIN_DRAWER_WIDTH = 240;
const APP_BAR_LEFT = MIN_DRAWER_WIDTH + Number(styles.verticalTabWidth);
const INITIAL_SELECTED_FILEL: Tree = {
  treeId: 'INTRODUCE',
  treeType: TreeType.FILE,
  treeName: 'introduce',
  treePath: ''
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);
  const [appBarLeft, setAppBarLeft] = useState<number>(APP_BAR_LEFT);
  const [verticalTabVaue, setVerticalTabVaue] = useState<number>(0);
  const [fileTabVaue, setFileTabVaue] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<Tree>(INITIAL_SELECTED_FILEL);
  const [files, setFiles] = useState<Tree[]>([]);

  const handleVerticalTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setVerticalTabVaue(newValue);
  };

  const handleFileTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFileTabVaue(newValue);
  };

  const handleDrawerShow = (tabNum: number) => {
    if (verticalTabVaue === tabNum) {
      setDrawerOpen(!drawerOpen);
    }
  };

  const getTree: UseQueryResult = useQuery([ApiName.GET_TREE, selectedFile.treeId], async () => await ApiHandler.callApi(ApiName.GET_TREE, null, null, selectedFile.treeId), {
    onSuccess(res: AxiosResponse) {
      const updatedFiles = [...files];
      updatedFiles[fileTabVaue] = res.data;
      setFiles(updatedFiles);
    },
  });

  const drawerResizeHandler = (mouseDownEvent: any) => {
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

  useEffect(() => {
    setAppBarLeft(drawerOpen ? drawerWidth + Number(styles.verticalTabWidth) : Number(styles.verticalTabWidth))
  }, [drawerOpen, drawerWidth])

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={verticalTabVaue}
        onChange={handleVerticalTabChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible', width: styles.verticalTabWidthPX }}
      >
        <Tab icon={<MenuIcon />} {...a11yProps(0)} onClick={() => handleDrawerShow(0)} />
        <Tab icon={<SearchOutlinedIcon />} {...a11yProps(1)} onClick={() => handleDrawerShow(1)} />
      </Tabs>
      <AppBar
        component="nav"
        color='transparent'
        sx={{
          left: appBarLeft,
          height: styles.appHeaderHeightPX
        }}
      >
        <Tabs
          value={fileTabVaue}
          onChange={handleFileTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <DrawerSection
        open={drawerOpen}
        drawerWidth={drawerWidth}
        verticalTabVaue={verticalTabVaue}
        setSelectedFile={setSelectedFile}
      />
      {drawerOpen && <Button id={styles.resizeButton} onMouseDown={drawerResizeHandler} />}
      <TabPanel value={verticalTabVaue} index={0}>
        <ViewSection
          open={drawerOpen}
          drawerWidth={drawerWidth}
          file={files[fileTabVaue]}
        />
      </TabPanel>
      <TabPanel value={verticalTabVaue} index={1}>
        {/* <ViewSection
          open={drawerOpen}
          drawerWidth={drawerWidth}
        /> */}
      </TabPanel>
    </Box>
  )
}

export default Home
