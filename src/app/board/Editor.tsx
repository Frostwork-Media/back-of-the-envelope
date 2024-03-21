import MonacoEditor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { memo, useEffect, useRef } from "react";
import { usePersistedStore, useSetJs } from "~/lib/usePersistedStore";

export const Editor = memo(function Editor() {
  const code = usePersistedStore((state) => state.code);
  const setJs = useSetJs();

  const editorRef = useRef<Parameters<OnMount>[0]>();

  useEffect(() => {
    const unsubscribe = usePersistedStore.subscribe(
      (state) => state.code,
      (code) => {
        if (editorRef.current) {
          editorRef.current.setValue(code);
        }
      },
    );

    return unsubscribe;
  }, []);

  return (
    <MonacoEditor
      height="400px"
      language="javascript"
      theme="vs-dark"
      defaultValue={code}
      onChange={(value) => {
        setJs(value ?? "", false).catch(console.error);
      }}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineDecorationsWidth: 10,
        lineNumbers: "off",
        padding: { top: 10, bottom: 10 },
        glyphMargin: false,
        folding: false,
      }}
    />
  );
});
