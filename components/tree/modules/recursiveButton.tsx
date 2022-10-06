import { ResTree, TreeType } from "@/src/models/tree.model";
import { Box, Button, Icon } from "@mui/material";
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import styles from '@/styles/tree.module.css'

interface Props {
  data: ResTree;
  index: number;
}
const RecursiveButton = ({ data, index }: Props) => {
  const hasChildren = data.treeChildren ? true : false;

  return (
    <div key={data.treeId}>
      <Button
        className={styles.treeButton}
      // onContextMenu={(e: any) => showButtonGroup(e, data)} 
      >
        {/* {data.treeId !== 0 && <Icon name={data.treeType === TreeType.FORDER ? 'folder open outline' : 'file alternate outline'} />} */}
        {data.treeType === TreeType.FORDER ? <FolderOpenOutlinedIcon className={styles.treeIcon} /> : <ArticleOutlinedIcon className={styles.treeIcon} />}
        {data.treeName}
      </Button>
      {hasChildren && data.treeChildren.map((item: ResTree, idx: number) => (
        <Box key={data.treeId + idx} className={styles.childRecursiveTreeSection}>
          <RecursiveButton key={item.treeId} data={item} index={idx} />
        </Box>
      ))}
    </div>
  )
}

export default RecursiveButton;