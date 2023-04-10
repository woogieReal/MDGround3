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

export const useEachTabContent = (files: Tree[]) => {
  const [eachTabContent, setEachTabContent] = useState<Map<number, string>>(new Map());

  useEffect(() => {

  }, []);

  return eachTabContent;
};