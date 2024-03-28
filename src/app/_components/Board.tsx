"use client";

import { usePersistedStore } from "~/lib/usePersistedStore";
import {
  ReactFlow,
  Background,
  type NodeTypes,
  ReactFlowProvider,
  BackgroundVariant,
} from "@xyflow/react";
import { CustomNode } from "./CustomNode";
import { Chat } from "./Chat";
import { CodePanel } from "./CodePanel";
import Image from "next/image";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function BoardInner() {
  const nodes = usePersistedStore((state) => state.nodes);
  const edges = usePersistedStore((state) => state.edges);

  return (
    <div className="grid h-[100dvh]">
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
        <Background
          size={1}
          gap={16}
          color="#74707c"
          variant={BackgroundVariant.Dots}
        />

        <Chat />
      </ReactFlow>
      <CodePanel />
      <Image
        src="/logo.svg"
        alt="logo"
        width={32}
        height={32}
        className="absolute left-4 top-4 hidden sm:block"
      />
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
