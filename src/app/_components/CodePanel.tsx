import { ArrowUp2, Code1 } from "iconsax-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Editor } from "./Editor";
import { memo } from "react";

export const CodePanel = memo(function CodePanel() {
  return (
    <div className="bg-red pointer-events-none absolute bottom-0 left-0 right-0 top-0">
      <PanelGroup direction="vertical">
        <Panel defaultSize={100} />
        <PanelResizeHandle className="pointer-events-auto flex items-center justify-start gap-2 bg-gradient-to-b from-neutral-500/0 to-neutral-800/20 p-3 transition-colors">
          <Code1 className="h-5 w-5" />
          <span className="text-sm font-bold">Show Code</span>
          <ArrowUp2 className="h-5 w-5" />
        </PanelResizeHandle>
        <Panel
          className="pointer-events-auto overflow-hidden border-t-2 border-brand-400/40 bg-black/70 backdrop-blur-lg"
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
});
