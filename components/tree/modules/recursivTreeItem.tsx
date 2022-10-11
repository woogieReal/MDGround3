import { ResGetTrees } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'

interface Props {
  data: ResGetTrees;
  depth: number;
}
const RecursivTreeItem = ({ data, depth }: Props) => {
  const hasChildren = data.treeChildren?.length > 0 ? true : false;

  return (
    <TreeItem nodeId={data.treeId} label={data.treeName} className={styles.treeItem}>
      {hasChildren && data.treeChildren.map((item: ResGetTrees, idx: number) => (
        <RecursivTreeItem key={item.treeId} data={item} depth={depth + 1} />
      ))}
    </TreeItem>
  )
}

export default RecursivTreeItem;