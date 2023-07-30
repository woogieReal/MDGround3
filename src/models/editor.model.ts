import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type EditorViewType = 'edit' | 'live' | 'preview';

export const EDITOR_OPTION: monaco.editor.IStandaloneEditorConstructionOptions = {
  tabSize: 2,
  minimap: {
    enabled: false
  },
  scrollbar: {
    vertical: 'hidden'
  },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
}