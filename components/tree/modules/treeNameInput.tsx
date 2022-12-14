import { Box } from "@mui/material";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { InitialTree, TEST_USER_ID, Tree, TreeType } from "@/src/models/tree.model";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from '@/styles/tree.module.scss'
import { isEnter } from "@/src/utils/common/keyPressUtil";
import { validateCreateTree } from "@/src/utils/tree/treeValidation";
import { ValidationResponse } from "@/src/models/validation.model";
import { useMutation } from "@tanstack/react-query";
import ApiHandler from "@/src/apis/apiHandler";
import { ApiName } from "@/src/apis/apiInfo";
import { AxiosResponse } from "axios";
import { createTreeFullPath } from "@/src/utils/tree/treeUtil";
import LodingBackDrop from "@/components/common/atoms/lodingBackDrop";

interface Props {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>> 
  targetTree?: Tree;
  uppertree?: Tree;
  sameDepthTreeNames: string[];
  treeType: TreeType;
  handleAfterCreate(newTree: Tree): void;
}

const TreeNameInput = ({ isShow, setIsShow, targetTree, uppertree, sameDepthTreeNames, treeType, handleAfterCreate }: Props) => {
  const [newTree, setNewTree] = useState<Tree>(InitialTree);
  const [isValidTreeName, setIsValidTreeName] = useState<boolean>(false);
  const [isReadyToCreate, setIsReadyToCreate] = useState<boolean>(false);

  const createTree = useMutation(async () => await ApiHandler.callApi(ApiName.CREATE_TREE, null, { ...newTree, userId: TEST_USER_ID }), {
    onSuccess(res: AxiosResponse) {
      cleanAllState();

      const newTree: Tree = res.data as Tree;
      handleAfterCreate(newTree);
    },
  });

  const cleanAllState = () => {
    setNewTree(InitialTree);
    setIsReadyToCreate(false);
    setIsShow(false);
  }

  const checkEmptyTreeName = () => !newTree.treeName.trim();
  const checkDuplicateTreeName = () => sameDepthTreeNames.includes(newTree.treeName);

  const checkValidTreeName = () => {
    return !checkEmptyTreeName() && !checkDuplicateTreeName();
  }

  const handlBlurNewTreeInput = () => {
    if (checkEmptyTreeName()) {
      cleanAllState();
    } else if (checkValidTreeName()) {
      checkReadyToCreate();
    }
  }

  const handleChangeNewTreeInput = (e: React.BaseSyntheticEvent) => {
    setNewTree({ ...newTree, treeName: e.target.value });
  }

  const handleKeyPressNewTreeInput = (e: any) => {
    isEnter(e) && isValidTreeName && checkReadyToCreate();
  }

  const checkReadyToCreate = () => {
    const response: ValidationResponse<Tree> = validateCreateTree(newTree);
    setNewTree(response.processedData);
    setIsReadyToCreate(response.isValid);
  }

  useEffect(() => {
    setIsValidTreeName(checkValidTreeName());
  }, [newTree.treeName])

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
  }, [isShow, uppertree, treeType])

  return (
    <Box {...(!isShow && { hidden: true })}>
      {newTree.treeType === TreeType.FORDER ? <FolderOutlinedIcon className={styles.newTreeInputIcon} /> : <DescriptionOutlinedIcon className={styles.newTreeInputIcon} />}
      <input
        id={styles.newTreeInput}
        className={isValidTreeName ? styles.readyToCreateInput : styles.notReadyToCreateInput}
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