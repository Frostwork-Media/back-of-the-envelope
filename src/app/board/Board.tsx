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
import { CodePanel } from "./CodePanel";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function BoardInner() {
  const nodes = usePersistedStore((state) => state.nodes);
  const edges = usePersistedStore((state) => state.edges);

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
        <Background size={1} gap={12} color="#55515f" />
        <Panel
          position="top-center"
          className="!mx-0 !my-2 grid w-full max-w-sm overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 shadow shadow-[black] md:max-w-lg"
        >
          <div className="flex items-center">
            <Chat />
          </div>
        </Panel>
      </ReactFlow>
      <CodePanel />
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
