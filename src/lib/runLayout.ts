import type { Node, Edge } from "@xyflow/react";
import dagre from "dagre";
import type { AppNodeData } from "./types";

// import { usePersistedStore } from "./usePersistedStore";

/**
 * Given nodes and edges, uses dagre to determine the positions
 */
export function runLayout(
  nodes: Node<AppNodeData>[],
  edges: Edge[],
  isTextStreaming: boolean,
): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    width: window.innerWidth,
    height: window.innerHeight,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // set aspect ratio
  nodes.forEach((node) => {
    g.setNode(node.id, { width: 300, height: 150 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      data: {
        ...node.data,
        isTextStreaming,
      },
      position: {
        x: pos.x - pos.width / 2,
        y: pos.y - pos.height / 2,
      },
    };
  });
}
