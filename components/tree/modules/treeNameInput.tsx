import { Box } from "@mui/material";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { InitialTree, TEST_USER_ID, Tree, TreeType } from "@/src/models/tree.model";
import { useEffect, useRef, useState } from "react";
import styles from '@/styles/tree.module.scss'
import { isEnter } from "@/src/utils/common/keyPressUtil";
import { validateCreateTree } from "@/src/utils/tree/validation";
import { ValidationResponse } from "@/src/models/validation.model";
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { createTreeFullPath } from "@/src/utils/tree/treeUtil";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";

interface Props {
  isShow: boolean;
  uppertree?: Tree;
  treeType: TreeType;
  handleAfterCreate(newTree: Tree, uppertree?: Tree): void;
}

const TreeNameInput = ({ isShow, uppertree, treeType, handleAfterCreate }: Props) => {
  const [newTree, setNewTree] = useState<Tree>(InitialTree);
  const [isReadyToCreate, setIsReadyToCreate] = useState<boolean>(false);
  const [isInputed, setIsInputed] = useState<boolean>(false);

  const createTree = useMutation(async () => await ApiHandler.callApi(ApiName.CREATE_TREE, null, { ...newTree, userId: TEST_USER_ID }), {
    onSuccess(res: AxiosResponse) {
      cleanAllState();

      const newTree: Tree = res.data as Tree;

      if (uppertree) {
        const treeChildren: Tree[] = uppertree.treeChildren || [];
        treeChildren.push(newTree);
        handleAfterCreate(newTree, { ...uppertree, treeChildren });
      } else {
        handleAfterCreate(newTree);
      }
    },
  });

  const cleanAllState = () => {
    setNewTree(InitialTree);
    setIsReadyToCreate(false);
    setIsInputed(false);
  }

  const handlBlurNewTreeInput = () => {
    isInputed && checkReadyToCreate();
  }

  const handleChangeNewTreeInput = (e: React.BaseSyntheticEvent) => {
    !isInputed && setIsInputed(true);
    setNewTree({ ...newTree, treeName: e.target.value });
  }

  const handleKeyPressNewTreeInput = (e: any) => {
    isEnter(e) && checkReadyToCreate();
  }

  const checkReadyToCreate = () => {
    const response: ValidationResponse = validateCreateTree(newTree);
    setNewTree(response.processedData);
    setIsReadyToCreate(response.isValid);
  }

  useEffect(() => {
    isReadyToCreate && createTree.mutate();
  }, [isReadyToCreate])

  useEffect(() => {
    setNewTree(newTree => {
      return {
        ...newTree,
        treeType,
        treePath: createTreeFullPath(uppertree)
      }
    });
  }, [uppertree, treeType])

  return (
    <Box {...(!isShow && { hidden: true })}>
      {newTree.treeType === TreeType.FORDER ? <FolderOutlinedIcon className={styles.newTreeInputIcon} /> : <DescriptionOutlinedIcon className={styles.newTreeInputIcon} />}
      <input
        id={styles.newTreeInput}
        type='text'
        value={newTree.treeName}
        onBlur={handlBlurNewTreeInput}
        onChange={handleChangeNewTreeInput}
        onKeyUp={handleKeyPressNewTreeInput}
      />
      <LodingBackDrop isOpen={createTree.isLoading} />
    </Box>
  )
}

export default TreeNameInput;