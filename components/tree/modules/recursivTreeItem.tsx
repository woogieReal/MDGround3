import { Tree } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'

interface Props {
  data: Tree;
  depth: number;
  onClickHandler: Function;
}
const RecursivTreeItem = ({ data, depth, onClickHandler }: Props) => {
  const hasChildren = data.treeChildren?.length! > 0 ? true : false;

  return (
    <TreeItem nodeId={data.treeId} label={data.treeName} className={styles.treeItem} onClick={() => onClickHandler(data)} >
      {hasChildren && data.treeChildren?.map((item: Tree, idx: number) => (
        <RecursivTreeItem key={item.treeId} data={item} depth={depth + 1} onClickHandler={onClickHandler} />
      ))}
    </TreeItem>
  )
}

export default RecursivTreeItem;