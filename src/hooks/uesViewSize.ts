import { useState, useEffect } from "react";
import { EditorViewType } from "../models/editor.model";
import { checkNotUndefined } from "../utils/common/commonUtil";

type ViewSize = [number, number];
const INITIAL_VIEW_SIZE: ViewSize = [6, 6];

export default function uesViewSize(viewType: EditorViewType | undefined) {
  const [viewSize, setViewSize] = useState<ViewSize>(INITIAL_VIEW_SIZE)

  useEffect(() => {
    if (checkNotUndefined(viewType)) {
      switch (viewType) {
        case 'edit': setViewSize([12, 0]); break;
        case 'live': setViewSize([6, 6]); break;
        case 'preview': setViewSize([0, 12]);  break;
      }
    }
  }, [viewType]);

  return viewSize;
}
