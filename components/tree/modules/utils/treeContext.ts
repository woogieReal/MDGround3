import { Tree, TreeType } from "@/src/models/tree.model";
import { checkInitalRootTree } from "@/src/utils/tree/treeCheck";
import { useState, useEffect } from "react";

export type TreeContextType = 'root' | 'folder' | 'file' | 'multiSelect'
export const useTreeContextType = (targetTree: Tree, multiSelectedTreeId: number[]) => {
  const [treeContextType, setTreeContextType] = useState<TreeContextType>('folder');

  useEffect(() => {
    if (multiSelectedTreeId.length > 0) {
      setTreeContextType('multiSelect');
    } else if (checkInitalRootTree(targetTree)) {
      setTreeContextType('root');
    } else if (targetTree.treeType === TreeType.FORDER) {
      setTreeContextType('folder');
    } else if (targetTree.treeType === TreeType.FILE) {
      setTreeContextType('file');
    }
  }, [targetTree, multiSelectedTreeId])

  return treeContextType;
}