import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type EditorViewType = 'edit' | 'live' | 'preview';

export const EDITOR_OPTION: monaco.editor.IStandaloneEditorConstructionOptions = {
  tabSize: 2,
}