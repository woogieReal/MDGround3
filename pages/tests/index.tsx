import { Box, makeStyles, TextField } from "@mui/material";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import styles from '@/styles/tree.module.scss'

const Home = () => {
  
  return (
    <Box>
      <Box>
        <Box className={`${styles.treeItemBox} ${styles.readOnly}`} sx={{ display: 'inline-block' }}>
          <FolderOutlinedIcon sx={{ mr: 1, }} />
          <TextField size="small" variant="outlined" disabled value={'아 뭐'} className={styles.readOnly} />
        </Box>
      </Box>
      <Box>
        <Box className={styles.treeItemBox} sx={{ display: 'inline-block' }}>
          <FolderOutlinedIcon sx={{ mr: 1, }} />
          <TextField size="small" variant="outlined" value={'아 뭐'} className={styles.editable} />
        </Box>
      </Box>
    </Box>
  )
}

export default Home;