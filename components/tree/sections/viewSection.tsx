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
import { checkEmptyValue, checkNotUndefined } from "@/src/utils/common/commonUtil";
import { NullableEditTabData, updateEachTabData, useCalculatedHeight, useCurrentTabTreeId, useEachTabContent } from "./utils/viewSection";

interface Props {
  open: boolean;
  drawerWidth: number;
  fileTabVaue: number;
  files: Tree[];
}
const ViewSection = ({ open, drawerWidth, fileTabVaue, files }: Props) => {
  const { width, height } = useWindowDimensions();

  const [editTabData, setEditTabData] = useState<NullableEditTabData>(null);
  
  const [editContentTree, setEditContentTree] = useState<Tree>(createInitialTree());
  const [isReadyToContentTree, setIsReadyToContentTree] = useState<boolean>(false);

  const eachTabData = useEachTabContent(files, fileTabVaue, editTabData);
  const currentTabTreeId = useCurrentTabTreeId(files, fileTabVaue);
  const calculatedHeight = useCalculatedHeight(height, Number(styles.appHeaderHeight), Number(styles.resizeButtonWidhth));

  const [ editorSize, viewerSize ] = uesViewSize(eachTabData.get(currentTabTreeId)?.viewType);
  
  const handleMountEditor: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => checkReadyToEditContent(editor.getValue()));
  }
  
  const handleClickViewType = (viewType: EditorViewType) => {
    setEditTabData([currentTabTreeId, { viewType }]);
  }
  
  // currentTabTreeId state 값이 변경되기 전에 호출되는 문제로 sessionStorage 사용
  const handlChangeContent: OnChange = (value, ev) => {
    setEditTabData([Number(sessionStorage.getItem('currentTabTreeId')), { MDContent: value }]);
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { ...editContentTree, treeStatus: TreeStatusInfo.EDIT_CONTENT }, files[fileTabVaue]?.treeId), {
    onSuccess(res: AxiosResponse) {
      setIsReadyToContentTree(false);
      showSnackbar('saved');
      setEditTabData([currentTabTreeId, { savedMDContent: editContentTree.treeContent }]);
    },
  });

  const checkReadyToEditContent = (content?: string) => {
    const response: ValidationResponse<Tree> = validateEditContentTree({ ...files[fileTabVaue], treeContent: content || eachTabData.get(currentTabTreeId)?.MDContent });
    setEditContentTree(response.processedData);
    setIsReadyToContentTree(response.isValid);
  }

  useEffect(() => {
    isReadyToContentTree && updateTree.mutate();
  }, [isReadyToContentTree])

  useEffect(() => {
    const tabContant = eachTabData.get(currentTabTreeId);

    if (tabContant && tabContant.savedMDContent !== tabContant.MDContent) {
      let timeout: NodeJS.Timeout;
      
      timeout = setTimeout(() => {
        checkReadyToEditContent();
      }, 5000);
  
      return () => clearTimeout(timeout);
    }
  }, [eachTabData.get(currentTabTreeId)]);

  return (
    <Box
      id={styles.viewSection}
      sx={{
        marginTop: styles.appHeaderHeightPX,
        marginLeft: open ? '0px' : `-${drawerWidth - Number(styles.resizeButtonWidhth)}px`
      }}
    >
      <CssBaseline />
      <Grid 
        container
        id={styles.viewMain}
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
          {checkNotUndefined(eachTabData.get(currentTabTreeId)?.viewType) &&
            <Editor
              value={eachTabData.get(currentTabTreeId)?.MDContent}
              width={editorSize === 0 ? editorSize : "100%"}
              height={editorSize === 0 ? editorSize : "89vh"}
              defaultLanguage="markdown"
              options={EDITOR_OPTION}
              onMount={handleMountEditor}
              onChange={handlChangeContent}
            />
          }
        </Grid>
        <Grid item
          xs={viewerSize}
          sx={{
            height: calculatedHeight,
            overflowY: 'scroll'
          }}
        >
          <div id={styles.viewer} dangerouslySetInnerHTML={{ __html: eachTabData.get(currentTabTreeId)?.HTMLContent || '' }} style={{ marginTop: -20 }} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewSection;