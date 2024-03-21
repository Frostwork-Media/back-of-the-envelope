import { Code1 } from "iconsax-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Editor } from "./Editor";

export function CodePanel() {
  return (
    <div className="bg-red pointer-events-none absolute bottom-0 left-0 right-0 top-0">
      <PanelGroup direction="vertical">
        <Panel />
        <PanelResizeHandle className="to-brand-900/0 hover:to-brand-900/20 pointer-events-auto flex items-center justify-end gap-2 bg-gradient-to-b from-neutral-500/0 p-3 transition-colors">
          <span className="text-sm font-bold">Show Code</span>
          <Code1 className="h-5 w-5" />
        </PanelResizeHandle>
        <Panel
          className="pointer-events-auto overflow-hidden border-t-2 border-neutral-700 bg-black/70 backdrop-blur-lg"
          collapsible
          collapsedSize={0}
          maxSize={90}
          minSize={0}
          defaultSize={0}
        >
          <Editor />
        </Panel>
      </PanelGroup>
    </div>
  );
}
