import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { Tree } from '@/src/models/tree.model';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";

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

  useEffect(() => {
    if (files[fileTabVaue]?.treeContent) {
      setContent(files[fileTabVaue]?.treeContent || '');
    }
  }, [files[fileTabVaue]?.treeContent]);

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Box id={styles.viewMain} sx={{ marginLeft: open ? '0px' : `-${drawerWidth}px` }}>
        <MDEditor
          value={content}
          onChange={(e) => setContent(e as string)}
          height={height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth) * 2)}
        />
      </Box>
    </Box>
  );
}

export default ViewSection;