import 'prismjs/themes/prism-coy.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import React, { useEffect, useState } from "react";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { EditorViewType, EDITOR_OPTION } from "@/src/models/editor.model";

import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { TEST_USER_ID, Tree, TreeStatusInfo } from '@/src/models/tree.model';
import { useMutation } from '@tanstack/react-query';
import ApiHandler from '@/src/apis/apiHandler';
import { ApiName } from '@/src/apis/apiInfo';
import { checkPressedCtrlEnter } from '@/src/utils/common/keyPressUtil';
import { ValidationResponse } from '@/src/models/validation.model';
import { validateEditContentTree } from '@/src/utils/tree/treeValidation';
import { AxiosResponse } from 'axios';
import { cloneDeep } from "lodash";
import { createInitialTree } from '@/src/utils/tree/treeUtil';
import { checkEmptyValue } from "@/src/utils/common/commonUtil";
import { showSnackbar } from "@/components/common/module/customSnackbar";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import parseMd from "@/src/utils/common/parserUtil";

interface Props {
  open: boolean;
  drawerWidth: number;
  fileTabVaue: number;
  files: Tree[];
}
const ViewSection = ({ open, drawerWidth, fileTabVaue, files }: Props) => {
  const { width, height } = useWindowDimensions();
  const [calculatedHeight, setCalculatedHeight] = useState<number>(1000);

  const [eachTabContent, setEachTabContent] = useState<Map<number, string>>(new Map());
  const [eachTabPreview, setEachTabPreview] = useState<Map<number, EditorViewType>>(new Map());
  const [currentTabTreeId, setCurrentTabTreeId] = useState<number>(0);
  const [currentTabHTML, setCurrentTabHtml] = useState<string>('');
  const [editContentTree, setEditContentTree] = useState<Tree>(createInitialTree());
  const [isReadyToContentTree, setIsReadyToContentTree] = useState<boolean>(false);

  const handlChangeContent: OnChange = (value, ev) => {
    const currentEachTabContent = new Map(eachTabContent);
    // currentTabTreeId state 값이 변경되기 전에 호출되는 문제로 sessionStorage 사용
    currentEachTabContent.set(Number(sessionStorage.getItem('currentTabTreeId')), value || '');
    setEachTabContent(currentEachTabContent);
    setCurrentTabHtml(parseMd(value));
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    checkPressedCtrlEnter(e) && checkReadyToEditContent();
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { ...editContentTree, treeStatus: TreeStatusInfo.EDIT_CONTENT , userId: TEST_USER_ID, }, files[fileTabVaue]?.treeId), {
    onSuccess(res: AxiosResponse) {
      setIsReadyToContentTree(false);
      showSnackbar('saved');
    },
  });

  const checkReadyToEditContent = () => {
    const response: ValidationResponse<Tree> = validateEditContentTree({ ...files[fileTabVaue], treeContent: eachTabContent.get(currentTabTreeId) });
    setEditContentTree(response.processedData);
    setIsReadyToContentTree(response.isValid);
  }

  useEffect(() => {
    isReadyToContentTree && updateTree.mutate();
  }, [isReadyToContentTree])

  useEffect(() => {
    setCalculatedHeight(height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2));
  }, [height])

  useEffect(() => {
    if (files[fileTabVaue]) {
      const targetTreeId = files[fileTabVaue].treeId;
      setCurrentTabTreeId(targetTreeId);

      const currentEachTabContent = cloneDeep(eachTabContent);
      const currentEachTabPreview = cloneDeep(eachTabPreview);

      if (!currentEachTabContent.get(targetTreeId)) {
        currentEachTabContent.set(targetTreeId, files[fileTabVaue].treeContent || '');
        
        setEachTabContent(currentEachTabContent);

        const isContentExist = !!files[fileTabVaue].treeContent;
        currentEachTabPreview.set(targetTreeId, isContentExist ? 'preview' : 'live');
        setEachTabPreview(currentEachTabPreview);
      }

      sessionStorage.setItem('currentTabTreeId', String(targetTreeId));
    }
  }, [files[fileTabVaue]]);

  useEffect(() => {
    const checkTabClosed = (): boolean => files.length < eachTabContent.size;

    if (checkTabClosed()) {
      const currentEachTabContent = cloneDeep(eachTabContent);
      const currentEachTabPreview = cloneDeep(eachTabPreview);

      const treeIdsBeforeTabClosed = Array.from(currentEachTabContent.keys());
      const treeIdsAfterTabClosed = files.map((file: Tree) => file.treeId);

      const tabClosedTreeId = treeIdsBeforeTabClosed.find((treeId: number) => !treeIdsAfterTabClosed.includes(treeId));

      currentEachTabContent.delete(tabClosedTreeId!);
      currentEachTabPreview.delete(tabClosedTreeId!);

      setEachTabContent(currentEachTabContent);
      setEachTabPreview(currentEachTabPreview);
    }
  }, [files.length]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!checkEmptyValue(eachTabContent.get(currentTabTreeId))) {
      timeout = setTimeout(() => {
        checkReadyToEditContent();
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [eachTabContent.get(currentTabTreeId)]);

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Grid 
        container
        id={styles.viewMain}
        sx={{ marginLeft: open ? '0px' : `-${drawerWidth - Number(styles.resizeButtonWidhth)}px` }}
      >
        <Grid item xs={6}>
          <Editor
            value={eachTabContent.get(currentTabTreeId)}
            defaultValue={eachTabContent.get(currentTabTreeId)}
            height="94vh"
            defaultLanguage="markdown"
            options={EDITOR_OPTION}
            onChange={handlChangeContent}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            height: calculatedHeight,
            overflowY: 'scroll'
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: currentTabHTML }} ></p>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewSection;