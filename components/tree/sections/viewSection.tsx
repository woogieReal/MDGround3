import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { TEST_USER_ID, Tree } from '@/src/models/tree.model';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import { useMutation } from '@tanstack/react-query';
import ApiHandler from '@/src/apis/apiHandler';
import { ApiName } from '@/src/apis/apiInfo';

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
  const [content, setContent] = useState<string>('');

  const isSaveKey = (e: any) => e.ctrlKey && e.code === 'Enter';

  const handlChangeContent = (e: any) => {
    setContent(e as string);
  }

  const handleKeyPress = (e: any) => {
    isSaveKey(e) && updateTree.mutate();
  }

  const updateTree = useMutation(async () => await ApiHandler.callApi(ApiName.UPDATE_TREE, null, { treeContent: content, userId: TEST_USER_ID }, files[fileTabVaue]?.treeId));

  useEffect(() => {
    if (files[fileTabVaue]?.treeContent) {
      setContent(files[fileTabVaue]?.treeContent || '');
    }
  }, [files[fileTabVaue]?.treeContent]);

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
          height={height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2)}
        />
      </Box>
    </Box>
  );
}

export default ViewSection;