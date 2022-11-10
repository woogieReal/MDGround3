import CssBaseline from '@mui/material/CssBaseline';
import { Dispatch, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { TEST_USER_ID, Tree } from '@/src/models/tree.model';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import { useMutation } from '@tanstack/react-query';
import ApiHandler from '@/src/apis/apiHandler';
import { ApiName } from '@/src/apis/apiInfo';
import { isCtrlEnter } from '@/src/utils/common/keyPressUtil';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';
import remarkBreaks from 'remark-breaks'
import * as commands from '@uiw/react-md-editor/lib/commands';
import { PreviewType } from '@uiw/react-md-editor/lib/Context';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor/lib/Editor"),
  { ssr: false }
);

interface Props {
  open: boolean;
  drawerWidth: number;
  fileTabVaue: number;
  files: Tree[];
}
const ViewSection = ({ open, drawerWidth, fileTabVaue, files }: Props) => {
  const { width, height } = useWindowDimensions();
  const [eachTabContent, setEachTabContent] = useState<Map<number, string>>(new Map());
  const [eachTabPreview, setEachTabPreview] = useState<Map<number, PreviewType>>(new Map());
  const [currentTabTreeId, setTreeId] = useState<number>(0);

  const cleanAllState = () => {
    setEachTabContent(new Map());
    setEachTabPreview(new Map());
    setTreeId(0);
  }

  const handlChangeContent = (e: any) => {
    const currentEachTabContent = new Map(eachTabContent);
    currentEachTabContent.set(currentTabTreeId, e as string);
    setEachTabContent(currentEachTabContent);
  }

  const handleKeyPress = (e: any) => {
    isCtrlEnter(e) && updateTree.mutate();
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { treeContent: eachTabContent.get(currentTabTreeId), userId: TEST_USER_ID }, files[fileTabVaue]?.treeId));

  const executeExtraCommands = (preview: PreviewType) => {
    setEachTabPreview(currentEachTabPreview => currentEachTabPreview.set(Number(localStorage.getItem('currentTabTreeId')), preview));
  }

  useEffect(() => {
    if (files[fileTabVaue]) {
      const targetTreeId = files[fileTabVaue].treeId;
      setTreeId(targetTreeId);

      const currentEachTabContent = new Map(eachTabContent);
      const currentEachTabPreview = new Map(eachTabPreview);

      if (!currentEachTabContent.get(targetTreeId)) {
        currentEachTabContent.set(targetTreeId, files[fileTabVaue].treeContent || '');
        setEachTabContent(currentEachTabContent);

        const isContentExist = !!files[fileTabVaue].treeContent;
        currentEachTabPreview.set(targetTreeId, isContentExist ? 'preview' : 'live');
        setEachTabPreview(currentEachTabPreview);
      }

      localStorage.setItem('currentTabTreeId', String(targetTreeId));
    } else {
      cleanAllState();
    }
  }, [files[fileTabVaue]]);

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Box
        id={styles.viewMain}
        sx={{ marginLeft: open ? '0px' : `-${drawerWidth - Number(styles.resizeButtonWidhth)}px` }}
        onKeyPress={handleKeyPress}
      >
        <MDEditor
          value={eachTabContent.get(currentTabTreeId)}
          onChange={handlChangeContent}
          preview={eachTabPreview.get(currentTabTreeId) || 'preview'}
          height={height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2)}
          previewOptions={{
            remarkPlugins: [[remarkBreaks]]
          }}
          extraCommands={[
            { ...commands.codeEdit, execute: function execute(state, api) { executeExtraCommands('edit') } },
            { ...commands.codeLive, execute: function execute(state, api) { executeExtraCommands('live') } },
            { ...commands.codePreview, execute: function execute(state, api) { executeExtraCommands('preview') } },
          ]}
        />
      </Box>
      <LodingBackDrop isOpen={updateTree.isLoading} />
    </Box>
  );
}

export default ViewSection;