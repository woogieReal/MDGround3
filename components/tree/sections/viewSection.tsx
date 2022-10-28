import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { Tree } from '@/src/models/tree.model';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

interface Props {
  open: boolean;
  drawerWidth: number;
  fileTabVaue: number;
  files: Tree[];
}
const ViewSection = ({ open, drawerWidth, fileTabVaue, files }: Props) => {

  const [num, setNum] = useState<number>(0);

  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `0px`,
    }),
  }));

  const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
  );
  const EditerMarkdown = dynamic(
    () =>
      import("@uiw/react-md-editor").then((mod) => {
        return mod.default.Markdown;
      }),
    { ssr: false }
  );

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Main open={open}>
        <MDEditor
          value={files[fileTabVaue]?.treeContent || ''}
          onChange={() => {}}
        />
        <EditerMarkdown source={files[fileTabVaue]?.treeContent || ''} style={{ whiteSpace: 'pre-wrap' }} />
      </Main>
    </Box>
  );
}

export default ViewSection;