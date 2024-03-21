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
      height="100%"
      language="javascript"
      theme="my-theme"
      defaultValue={code}
      onChange={(value) => {
        setJs(value ?? "", false).catch(console.error);
      }}
      onMount={(editor, monaco) => {
        editorRef.current = editor;

        monaco.editor.defineTheme("my-theme", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#ffffff00",
          },
        });

        // set theme
        monaco.editor.setTheme("my-theme");
      }}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineDecorationsWidth: 15,
        lineNumbers: "off",
        padding: { top: 15, bottom: 15 },
        glyphMargin: false,
        folding: false,
        fontSize: 16,
        renderLineHighlight: "none",
      }}
    />
  );
});
