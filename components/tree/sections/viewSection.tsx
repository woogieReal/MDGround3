import React, { useEffect, useState } from "react";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { EditorViewType, EDITOR_OPTION } from "@/src/models/editor.model";

import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, ButtonGroup, Grid, IconButton } from '@mui/material';
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
import { showSnackbar } from "@/components/common/module/customSnackbar";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import parseMd from "@/src/utils/common/parserUtil";
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import uesViewSize from "@/src/hooks/uesViewSize";

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
  const [eachTabViewType, setEachTabViewType] = useState<Map<number, EditorViewType>>(new Map());
  const [currentTabTreeId, setCurrentTabTreeId] = useState<number>(0);
  const [currentTabHTML, setCurrentTabHtml] = useState<string>('');
  const [editContentTree, setEditContentTree] = useState<Tree>(createInitialTree());
  const [isReadyToContentTree, setIsReadyToContentTree] = useState<boolean>(false);
  const [ editorSize, viewerSize ] = uesViewSize(eachTabViewType.get(currentTabTreeId));
  
  const handleClickViewType = (viewType: EditorViewType) => {
    const currentEachTabPreview = cloneDeep(eachTabViewType);
    currentEachTabPreview.set(currentTabTreeId, viewType);
    setEachTabViewType(currentEachTabPreview);
  }
  
  const handleMountEditor: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => checkReadyToEditContent(editor.getValue()))
  }

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

  const checkReadyToEditContent = (content?: string) => {
    const response: ValidationResponse<Tree> = validateEditContentTree({ ...files[fileTabVaue], treeContent: content || eachTabContent.get(currentTabTreeId) });
    setEditContentTree(response.processedData);
    setIsReadyToContentTree(response.isValid);
  }

  useEffect(() => {
    isReadyToContentTree && updateTree.mutate();
  }, [isReadyToContentTree])

  useEffect(() => {
    setCalculatedHeight(height - (40 + Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2));
  }, [height])

  useEffect(() => {
    if (files[fileTabVaue]) {
      const targetTreeId = files[fileTabVaue].treeId;
      setCurrentTabTreeId(targetTreeId);

      const currentEachTabContent = cloneDeep(eachTabContent);
      const currentEachTabPreview = cloneDeep(eachTabViewType);

      if (!currentEachTabContent.get(targetTreeId)) {
        currentEachTabContent.set(targetTreeId, files[fileTabVaue].treeContent || '');
        
        setEachTabContent(currentEachTabContent);

        const isContentExist = !!files[fileTabVaue].treeContent;
        currentEachTabPreview.set(targetTreeId, isContentExist ? 'preview' : 'live');
        setEachTabViewType(currentEachTabPreview);
      }

      sessionStorage.setItem('currentTabTreeId', String(targetTreeId));
    }
  }, [files[fileTabVaue]]);

  useEffect(() => {
    const checkTabClosed = (): boolean => files.length < eachTabContent.size;

    if (checkTabClosed()) {
      const currentEachTabContent = cloneDeep(eachTabContent);
      const currentEachTabPreview = cloneDeep(eachTabViewType);

      const treeIdsBeforeTabClosed = Array.from(currentEachTabContent.keys());
      const treeIdsAfterTabClosed = files.map((file: Tree) => file.treeId);

      const tabClosedTreeId = treeIdsBeforeTabClosed.find((treeId: number) => !treeIdsAfterTabClosed.includes(treeId));

      currentEachTabContent.delete(tabClosedTreeId!);
      currentEachTabPreview.delete(tabClosedTreeId!);

      setEachTabContent(currentEachTabContent);
      setEachTabViewType(currentEachTabPreview);
    }
  }, [files.length]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    timeout = setTimeout(() => {
      checkReadyToEditContent();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [eachTabContent.get(currentTabTreeId)]);

  return (
    <Box id={styles.viewSection} sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Grid 
        container
        id={styles.viewMain}
        sx={{ marginLeft: open ? '0px' : `-${drawerWidth - Number(styles.resizeButtonWidhth)}px` }}
        rowSpacing={1}
      >
        <Grid item xs={12}>
          <ButtonGroup size="small" aria-label="small button group">
            <IconButton onClick={() => handleClickViewType('edit')} children={<EditOutlinedIcon />} />
            <IconButton onClick={() => handleClickViewType('live')} children={<ImportContactsOutlinedIcon />} />
            <IconButton onClick={() => handleClickViewType('preview')} children={<RemoveRedEyeOutlinedIcon />} />
          </ButtonGroup>
        </Grid>
        <Grid item
          xs={editorSize}
        >
          <Editor
            value={eachTabContent.get(currentTabTreeId)}
            defaultValue={eachTabContent.get(currentTabTreeId)}
            width={editorSize === 0 ? editorSize : "100%"}
            height={editorSize === 0 ? editorSize : "89vh"}
            defaultLanguage="markdown"
            options={EDITOR_OPTION}
            onMount={handleMountEditor}
            onChange={handlChangeContent}
          />
        </Grid>
        <Grid item
          xs={viewerSize}
          sx={{
            height: calculatedHeight,
            overflowY: 'scroll'
          }}
        >
          <div id={styles.viewer} dangerouslySetInnerHTML={{ __html: currentTabHTML }} style={{ marginTop: -20 }} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewSection;