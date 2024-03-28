import type { OnMount } from "@monaco-editor/react";

// Declare the monaco editor on the window
declare global {
  interface Window {
    _editor?: Parameters<OnMount>[0];
  }
}

export function writeTextToEditor(text: string) {
  if (window._editor) {
    window._editor.setValue(text);
  }
}
