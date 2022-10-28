import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface Props {
  value: string;
  setValue: (newValue: string) => void;
}

const UiwMdEditer = ({ value, setValue }: Props) => {
  return (
    <MDEditor value={value} onChange={(e) => setValue(e as string)} />
  );
}

export default UiwMdEditer;