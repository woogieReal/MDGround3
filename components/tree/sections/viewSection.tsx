import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/tree.module.scss'
import { Tree } from '@/src/models/tree.model';

interface Props {
  open: boolean;
  drawerWidth: number;
  file: Tree;
}
const ViewSection = ({ open, drawerWidth, file }: Props) => {

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

  return (
    <Box sx={{ marginTop: styles.appHeaderHeightPX }} >
      <CssBaseline />
      <Main open={open}>
        {/* <Button onClick={() => setNum(num + 1)}>{num}</Button> */}
        <div dangerouslySetInnerHTML={{ __html: file?.treeContent || '' }}></div>
        {/* <div>{file?.treeContent}</div> */}
      </Main>
    </Box>
  );
}

export default ViewSection;