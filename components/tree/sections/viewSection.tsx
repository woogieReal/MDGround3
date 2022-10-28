import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { Tree } from '@/src/models/tree.model';
import UiwMdEditer from '@/components/tree/modules/uiwMDEditer';

interface Props {
  open: boolean;
  drawerWidth: number;
  fileTabVaue: number;
  files: Tree[];
}
const ViewSection = ({ open, drawerWidth, fileTabVaue, files }: Props) => {

  const [num, setNum] = useState<number>(0);
  const [content, setContent] = useState<string>(files[fileTabVaue]?.treeContent || '');

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
  }, [files[fileTabVaue]?.treeContent])

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Main id={styles.viewMain} open={open}>
        <UiwMdEditer
          value={content}
          setValue={setContent}
        />
      </Main>
    </Box>
  );
}

export default ViewSection;