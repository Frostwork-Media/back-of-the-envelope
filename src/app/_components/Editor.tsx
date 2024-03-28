import MonacoEditor from "@monaco-editor/react";
import { memo } from "react";
import { usePersistedStore, useSetJs } from "~/lib/usePersistedStore";

export const Editor = memo(function Editor() {
  const setJs = useSetJs();

  return (
    <MonacoEditor
      height="100%"
      language="javascript"
      theme="my-theme"
      value={usePersistedStore.getState().code}
      onChange={(value) => {
        setJs(value ?? "", false, false);
      }}
      onMount={(editor, monaco) => {
        window._editor = editor;

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
