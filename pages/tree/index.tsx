import DrawerSection from '@/components/tree/sections/drawerSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Tabs, Tab, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '@/styles/tree.module.scss'
import MenuIcon from '@mui/icons-material/Menu';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TabPanel from '@/components/common/atoms/tabPanel'
import { Tree } from '@/src/models/tree.model'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo'
import ApiHandler from '@/src/apis/apiHandler'
import { AxiosResponse } from 'axios'

const MIN_DRAWER_WIDTH = 240;

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);
  const [verticalTabVaue, setVerticalTabVaue] = useState<number>(0);
  const [viewTabValue, setViewTabValue] = useState<number>(0);
  const [trees, setTrees] = useState<Tree[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setVerticalTabVaue(newValue);
  };

  const handleDrawerShow = (tabNum: number) => {
    if (verticalTabVaue === tabNum) {
      setDrawerOpen(!drawerOpen);
    }
  };

  // const getTree: UseQueryResult = useQuery([ApiName.GET_TREE, trees[viewTabValue].treeId], async () => await ApiHandler.callApi(ApiName.GET_TREE, null, null, trees[viewTabValue].treeId), {
  //   onSuccess(res: AxiosResponse) {
  //     console.log(res);
  //   },
  // });

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

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={verticalTabVaue}
        onChange={handleTabChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible', width: styles.verticalTabWidthPX }}
      >
        <Tab icon={<MenuIcon />} {...a11yProps(0)} onClick={() => handleDrawerShow(0)} />
        <Tab icon={<SearchOutlinedIcon />} {...a11yProps(1)} onClick={() => handleDrawerShow(1)} />
      </Tabs>
      <DrawerSection
        open={drawerOpen}
        drawerWidth={drawerWidth}
        verticalTabVaue={verticalTabVaue}
      />
      {drawerOpen && <Button id={styles.resizeButton} onMouseDown={drawerResizeHandler} />}
      <TabPanel value={verticalTabVaue} index={0}>
        <ViewSection
          open={drawerOpen}
          drawerWidth={drawerWidth}
        />
      </TabPanel>
      <TabPanel value={verticalTabVaue} index={1}>
        <ViewSection
          open={drawerOpen}
          drawerWidth={drawerWidth}
        />
      </TabPanel>
    </Box>
  )
}

export default Home
