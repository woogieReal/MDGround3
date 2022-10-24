import { Tree } from "@/src/models/tree.model";
import TreeItem from "@mui/lab/TreeItem";
import styles from '@/styles/tree.module.scss'

interface Props {
  data: Tree;
  depth: number;
  onClickHandler: Function;
  onDoubleClickHandler: Function;
}
const RecursivTreeItem = ({ data, depth, onClickHandler, onDoubleClickHandler }: Props) => {
  const hasChildren = data.treeChildren?.length! > 0 ? true : false;

  return (
    <TreeItem
      nodeId={String(data.treeId)}
      label={data.treeName}
      className={styles.treeItem}
      onClick={() => onClickHandler(data)}
      onDoubleClick={() => onDoubleClickHandler(data)}
    >
      {hasChildren && data.treeChildren?.map((item: Tree, idx: number) => (
        <RecursivTreeItem key={item.treeId} data={item} depth={depth + 1} onClickHandler={onClickHandler} onDoubleClickHandler={onDoubleClickHandler} />
      ))}
    </TreeItem>
  )
}

export default RecursivTreeItem;