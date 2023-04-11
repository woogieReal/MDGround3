import { EditorViewType } from "@/src/models/editor.model";
import { Tree } from "@/src/models/tree.model";
import { useState, useEffect } from "react";
import _ from 'lodash';
import { checkEmptyValue } from "@/src/utils/common/commonUtil";
import parseMd from "@/src/utils/common/parserUtil";

export type TabData = {
  viewType: EditorViewType,
  MDContent: string,
  HTMLContent: string,
  savedMDContent: string,
}
export type EachTabData = Map<number, TabData>;
export type EditTabData = [number, Partial<TabData>];
export type NullableEditTabData = null | EditTabData;

export const createInitialTabData = (MDContent: string | undefined): TabData => {
  const md = MDContent || '';
  return {
    viewType: checkEmptyValue(md) ? 'live' : 'preview',
    MDContent: md,
    HTMLContent: parseMd(md),
    savedMDContent: md,
  }
}

export const updateEachTabData = (eachTabData: EachTabData, targetTreeId: number, newTabData: Partial<TabData>): EachTabData => {
  const currentEachTabData = _.cloneDeep(eachTabData);
  const currentTabData = currentEachTabData.get(targetTreeId) || createInitialTabData(newTabData.MDContent);
  
  let k: keyof TabData;
  for (k in newTabData) {
    if (k === 'viewType') {
      currentTabData[k] = newTabData[k] as EditorViewType;
    } else if (k === 'MDContent') {
      currentTabData[k] = newTabData[k] || '';
      currentTabData['HTMLContent'] = parseMd(newTabData[k]);
    } else {
      currentTabData[k] = newTabData[k] || '';
    }
  }

  currentEachTabData.set(targetTreeId, currentTabData);
  return currentEachTabData;
}

export const useEachTabContent = (files: Tree[], fileTabVaue: number, editTabData: NullableEditTabData) => {
  const [eachTabData, setEachTabData] = useState<EachTabData>(new Map());

  useEffect(() => {
    if (files[fileTabVaue]) {
      const targetTreeId = files[fileTabVaue].treeId;
      const MDContent = files[fileTabVaue].treeContent || ''; 
      setEachTabData(updateEachTabData(eachTabData, targetTreeId, { MDContent }));
    }
  }, [files[fileTabVaue]]);

  useEffect(() => {
    const checkTabClosed = (): boolean => files.length < eachTabData.size;

    if (checkTabClosed()) {
      const currentEachTabData = _.cloneDeep(eachTabData);

      const treeIdsBeforeTabClosed = Array.from(currentEachTabData.keys());
      const treeIdsAfterTabClosed = files.map((file: Tree) => file.treeId);

      const tabClosedTreeId = treeIdsBeforeTabClosed.find((treeId: number) => !treeIdsAfterTabClosed.includes(treeId));

      currentEachTabData.delete(tabClosedTreeId!);

      setEachTabData(currentEachTabData);
    }
  }, [files.length]);

  useEffect(() => {
    if (editTabData) {
      const [targetTreeId, newTabData] = editTabData;
      setEachTabData(updateEachTabData(eachTabData, targetTreeId, newTabData));
    }
  }, [editTabData])

  return eachTabData;
};

export const useCurrentTabTreeId = (files: Tree[], fileTabVaue: number) => {
  const [currentTabTreeId, setCurrentTabTreeId] = useState<number>(0);

  useEffect(() => {
    if (files[fileTabVaue]) {
      const targetTreeId = files[fileTabVaue].treeId;
      setCurrentTabTreeId(targetTreeId);
      sessionStorage.setItem('currentTabTreeId', String(targetTreeId));
    }
  }, [files[fileTabVaue]]);

  return currentTabTreeId;
}

export const useCalculatedHeight = (windowHeight: number, appHeaderHeight: number, resizeButtonWidhth: number) => {
  const [calculatedHeight, setCalculatedHeight] = useState<number>(1000);

  useEffect(() => {
    setCalculatedHeight(windowHeight - (40 + Number(appHeaderHeight) + Number(resizeButtonWidhth) * 2));
  }, [windowHeight]);

  return calculatedHeight;
}