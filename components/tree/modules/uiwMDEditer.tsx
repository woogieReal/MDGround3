import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "@/src/hooks/useWindowDimensions";
import styles from '@/styles/tree.module.scss'

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface Props {
  value: string;
  setValue: (newValue: string) => void;
}

const UiwMdEditer = ({ value, setValue }: Props) => {
  const { width, height } = useWindowDimensions();

  return (
    <MDEditor
      value={value}
      onChange={(e) => setValue(e as string)}
      height={height - (Number(styles.appHeaderHeight) + Number(styles.resizeButtonWidhth)*2)}
    />
  );
}

export default UiwMdEditer;