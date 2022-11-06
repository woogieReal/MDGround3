import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { TEST_USER_ID, Tree } from '@/src/models/tree.model';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import { useMutation } from '@tanstack/react-query';
import ApiHandler from '@/src/apis/apiHandler';
import { ApiName } from '@/src/apis/apiInfo';
import { isCtrlEnter } from '@/src/scripts/common/keyPress';
import LodingBackDrop from '@/components/common/atoms/lodingBackDrop';
import remarkBreaks from 'remark-breaks'

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
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
  const [isReading, setIsReading] = useState<boolean>(true);
  const [content, setContent] = useState<string>('');

  const handlChangeContent = (e: any) => {
    setContent(e as string);
  }

  const handleKeyPress = (e: any) => {
    isCtrlEnter(e) && updateTree.mutate();
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { treeContent: content, userId: TEST_USER_ID }, files[fileTabVaue]?.treeId));

  useEffect(() => {
    if (files[fileTabVaue]) {
      const idContentExist = !!files[fileTabVaue]?.treeContent;
      setIsReading(idContentExist);
      setContent(files[fileTabVaue]?.treeContent || '');
    } else {
      setIsReading(false);
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
          value={content}
          onChange={handlChangeContent}
          preview={isReading ? 'preview' : 'live'}
          height={height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2)}
          previewOptions={{
            remarkPlugins: [[remarkBreaks]]
          }}
        />
      </Box>
      <LodingBackDrop isOpen={updateTree.isLoading} />
    </Box>
  );
}

export default ViewSection;