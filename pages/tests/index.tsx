import React, { useEffect, useState } from "react";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Editor, { useMonaco } from "@monaco-editor/react";
import Markdown from 'markdown-to-jsx';

const Home = () => {
  
  const monaco = useMonaco();

  const [value, setValue] = useState<string>('');

  const editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {
    tabSize: 2,
  }

  const handleEditorChange = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setValue(value!);
  }

  useEffect(() => {
    if (monaco) {
      // console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);

  return (
    <div>
      <Editor
        value={value}
        height="90vh"
        // defaultValue="// some comment"
        // theme="vs-dark"
        defaultLanguage="markdown"
        options={editorOption}
        onChange={handleEditorChange}
      />
      <Markdown
        children={value}
      />
    </div>
  );
}

export default Home;