"use client";

import { usePersistedStore } from "~/lib/usePersistedStore";
import {
  ReactFlow,
  Background,
  type NodeTypes,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import { CustomNode } from "./CustomNode";
import { Chat } from "./Chat";
import { CodePanel } from "./CodePanel";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { GRAPH_MAX_ZOOM, GRAPH_MIN_ZOOM } from "~/lib/constants";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function BoardInner() {
  const nodes = usePersistedStore((state) => state.nodes);
  const edges = usePersistedStore((state) => state.edges);

  const { fitView } = useReactFlow();
  const fitTimer = useRef<Timer | null>(null);
  useEffect(() => {
    if (!fitView) return;

    // check if the timer is already running
    if (fitTimer.current) {
      clearTimeout(fitTimer.current);
    }

    // start a new timer
    fitTimer.current = setTimeout(() => {
      fitView({ duration: 300, maxZoom: GRAPH_MAX_ZOOM });
      fitTimer.current = null;
    }, 300);
  }, [fitView, nodes.length]);

  return (
    <div className="grid h-[100dvh]">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        maxZoom={GRAPH_MAX_ZOOM}
        minZoom={GRAPH_MIN_ZOOM}
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
          size={1.5}
          gap={16}
          color="#583d85"
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
