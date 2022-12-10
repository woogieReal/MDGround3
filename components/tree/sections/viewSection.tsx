import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { InitialTree, TEST_USER_ID, Tree } from '@/src/models/tree.model';
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
import { ValidationResponse } from '@/src/models/validation.model';
import { validateEditContentTree } from '@/src/utils/tree/validation';
import { AxiosResponse } from 'axios';
import { cloneDeep } from "lodash";

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
  const [currentTabTreeId, setCurrentTabTreeId] = useState<number>(0);
  const [editContentTree, setEditContentTree] = useState<Tree>(InitialTree);
  const [isReadyToContentTree, setIsReadyToContentTree] = useState<boolean>(false);

  const handlChangeContent = (e: any) => {
    const currentEachTabContent = new Map(eachTabContent);
    currentEachTabContent.set(currentTabTreeId, e as string);
    setEachTabContent(currentEachTabContent);
  }

  const handleKeyPress = (e: any) => {
    isCtrlEnter(e) && checkReadyToEditContent();
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { ...editContentTree, userId: TEST_USER_ID, }, files[fileTabVaue]?.treeId), {
    onSuccess(res: AxiosResponse) {
      setIsReadyToContentTree(false);
    },
  });

  const executeExtraCommands = (preview: PreviewType) => {
    setEachTabPreview(currentEachTabPreview => currentEachTabPreview.set(Number(sessionStorage.getItem('currentTabTreeId')), preview));
  }

  const checkReadyToEditContent = () => {
    const response: ValidationResponse = validateEditContentTree({ ...files[fileTabVaue], treeContent: eachTabContent.get(currentTabTreeId) });
    setEditContentTree(response.processedData);
    setIsReadyToContentTree(response.isValid);
  }

  useEffect(() => {
    isReadyToContentTree && updateTree.mutate();
  }, [isReadyToContentTree])

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
  }, [files]);

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