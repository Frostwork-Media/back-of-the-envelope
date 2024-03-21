"use client";

import { usePersistedStore } from "~/lib/usePersistedStore";
import {
  ReactFlow,
  Background,
  type NodeTypes,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import { CustomNode } from "./CustomNode";
import { Chat } from "./Chat";
import { ArrowDown2 } from "iconsax-react";
import { Editor } from "./Editor";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function BoardInner() {
  const nodes = usePersistedStore((state) => state.nodes);
  const edges = usePersistedStore((state) => state.edges);
  const code = usePersistedStore((state) => state.code);

  return (
    <div className="grid h-screen">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        maxZoom={1.5}
        fitView
        // onNodesChange={(changes) => {
        //   for (const change of changes) {
        //     if (change.type === "position") {
        //       usePersistedStore.setState((state) => ({
        //         nodes: state.nodes.map((node) => {
        //           if (node.id === change.id && change.position) {
        //             return {
        //               ...node,
        //               position: change.position,
        //             };
        //           }
        //           return node;
        //         }),
        //       }));
        //     }
        //   }
        // }}
      >
        <Background size={1} gap={12} color="#e0e0e0" />
        <Panel
          position="top-right"
          className="grid w-full max-w-lg overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xl"
        >
          <Chat />
          <button className="flex items-center justify-center gap-2 bg-indigo-500 p-2 text-sm text-white">
            <ArrowDown2 className="h-4 w-4" />
            <span className="-mt-px">Show Code</span>
          </button>
          <Editor />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function Board() {
  return (
    <ReactFlowProvider>
      <BoardInner />
    </ReactFlowProvider>
  );
}
