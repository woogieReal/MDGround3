import DrawerSection from '@/components/tree/sections/drawerSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Box, Button, Tabs, Tab, AppBar, IconButton } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '@/styles/tree.module.scss'
import MenuIcon from '@mui/icons-material/Menu';
import TabPanel from '@/components/common/atoms/tabPanel'
import { TEST_USER_ID, Tree, TreeStatusInfo, TreeType } from '@/src/models/tree.model'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiName } from '@/src/apis/apiInfo'
import ApiHandler from '@/src/apis/apiHandler'
import { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { CommonQueryOptions } from '@/src/apis/reactQuery'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { removeTargetIndexDataFromArray } from '@/src/utils/common/arrayUtil'
import { oneMinusUnlessZero } from '@/src/utils/common/numberUtil'
import { cloneDeep } from 'lodash'

const MIN_DRAWER_WIDTH = 240;
const APP_BAR_LEFT = MIN_DRAWER_WIDTH + Number(styles.verticalTabWidth);

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  // drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);

  // appBar
  const [appBarLeft, setAppBarLeft] = useState<number>(APP_BAR_LEFT);

  // tabs
  const [verticalTabVaue, setVerticalTabVaue] = useState<number>(0);
  const [fileTabVaue, setFileTabVaue] = useState<number>(0);

  const [selectedFile, setSelectedFile] = useState<Tree | null>(null);
  const [files, setFiles] = useState<Tree[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);

  const [treeStatusInfo, setTreeStatusInfo] = useState<TreeStatusInfo>(TreeStatusInfo.DEFAULT);

  const handleVerticalTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setVerticalTabVaue(newValue);
  };

  const handleFileTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFileTabVaue(newValue);
  };

  const handleDrawerShow = (tabNum: number) => {
    if (verticalTabVaue === tabNum) {
      !drawerOpen && drawerWidth === 0 && setDrawerWidth(MIN_DRAWER_WIDTH);
      setDrawerOpen(!drawerOpen);
    }
  };

  const openNewFile = (data: Tree) => {
    const newFileTabValue = files[fileTabVaue]?.treeStatus === TreeStatusInfo.TEMP_READ ? fileTabVaue : files.length;
    setFileTabVaue(newFileTabValue);
    setSelectedFile(data);
  }

  const setTempReadFileToDefault = () => {
    if (files[fileTabVaue].treeStatus === TreeStatusInfo.TEMP_READ) {
      const copyFiles = cloneDeep(files);
      copyFiles[fileTabVaue].treeStatus = TreeStatusInfo.DEFAULT;
      setFiles(copyFiles);
    }
  }

  const handleTreeClick = (data: Tree, isFromDoubleClick = false) => {
    if (data.treeType === TreeType.FILE) {
      !isFromDoubleClick && setTreeStatusInfo(TreeStatusInfo.TEMP_READ);
      setTimeout(() => {
        const tabValue = selectedFileIds.indexOf(data.treeId);
        if (tabValue >= 0) {
          setFileTabVaue(tabValue);
          isFromDoubleClick && setTempReadFileToDefault();
        } else {
          openNewFile(data);
        }
      }, 150)
    }
  };

  const handleTreeDoubleClick = (data: Tree) => {
    if (data.treeType === TreeType.FILE) {
      setTreeStatusInfo(TreeStatusInfo.DEFAULT);
      if (files.length === 0) {
        handleTreeClick(data, true);
      } else {
        if (selectedFileIds.includes(data.treeId)) {
          handleTreeClick(data, true);
        } else {
          openNewFile(data);
        }
      }
    }
  };

  const deleteTabByTreeId = (data: Tree) => {
    if (data.treeType === TreeType.FILE) {
      const targetTabNum = files.findIndex((file: Tree) => file.treeId === data.treeId);
      if (targetTabNum >= 0) {
        handleClickDeleteTab(data, targetTabNum)
      }
    }
  };

  const handleClickDeleteTab = (data: Tree, targetTabNum: number) => {
    targetTabNum <= fileTabVaue && setFileTabVaue(oneMinusUnlessZero);
    data.treeId === selectedFile?.treeId && setSelectedFile(null);
    setFiles(files => removeTargetIndexDataFromArray(files, targetTabNum));
  }

  const getTree: UseQueryResult = useQuery([ApiName.GET_TREE, selectedFile?.treeId], async () => selectedFile && await ApiHandler.callApi(ApiName.GET_TREE, { userId: TEST_USER_ID }, null, selectedFile.treeId), {
    ...CommonQueryOptions,
    onSuccess(res: AxiosResponse) {
      if (res) {
        const updatedFiles = [...files];
        updatedFiles[fileTabVaue] = { ...res.data, treeStatus: treeStatusInfo };
        setFiles(updatedFiles);
      }
    },
  });

  const drawerResizeHandler = (mouseDownEvent: any) => {
    const startSize = drawerWidth;
    const startPosition = mouseDownEvent.pageX;

    const onMouseMove = (mouseMoveEvent: any) => {
      const width = startSize - startPosition + mouseMoveEvent.pageX;
      if (width > 0) {
        setDrawerOpen(true);
        setDrawerWidth(width);
      } else {
        setDrawerOpen(false);
        setDrawerWidth(0);
      }
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

  useEffect(() => {
    setSelectedFileIds(files.map((file: Tree) => file.treeId))
  }, [files])

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
        {/* <Tab icon={<SearchOutlinedIcon />} {...a11yProps(1)} onClick={() => handleDrawerShow(1)} /> */}
      </Tabs>
      <AppBar
        id={styles.fileTabSection}
        component="nav"
        color='inherit'
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
          {files?.map((file: Tree, index: number) => (
            <Tab key={`${index}-${file.treeId}`} {...a11yProps(index)} component={() => (
              <Box className={styles.fileTabBox}>
                <Button
                  className={`${styles.fileTabButton} ${file.treeStatus === TreeStatusInfo.TEMP_READ && styles.tempRead}`}
                  sx={{ color: 'inherit', font: 'inherit' }}
                  onClick={() => setFileTabVaue(index)}
                >
                  {file.treeName}
                </Button>
                <IconButton size="small" onClick={() => handleClickDeleteTab(file, index)} >
                  <ClearOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )} />
          ))}
        </Tabs>
      </AppBar>
      <DrawerSection
        open={drawerOpen}
        drawerWidth={drawerWidth}
        setFiles={setFiles}
        handleTreeClick={handleTreeClick}
        handleTreeDoubleClick={handleTreeDoubleClick}
        deleteTabByTreeId={deleteTabByTreeId}
      />
      <Button id={styles.resizeButton} onMouseDown={drawerResizeHandler} />
      <TabPanel value={verticalTabVaue} index={0}>
        <ViewSection
          open={drawerOpen}
          drawerWidth={drawerWidth}
          fileTabVaue={fileTabVaue}
          files={files}
        />
      </TabPanel>
      {/* <TabPanel value={verticalTabVaue} index={1}></TabPanel> */}
    </Box>
  )
}

export default Home
