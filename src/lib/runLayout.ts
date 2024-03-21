import type { Node, Edge } from "@xyflow/react";
import dagre from "dagre";

// import { usePersistedStore } from "./usePersistedStore";

/**
 * Given nodes and edges, uses dagre to determine the positions
 */
export async function runLayout(nodes: Node[], edges: Edge[]): Promise<Node[]> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR" });
  g.setDefaultEdgeLabel(() => ({}));

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
      position: {
        x: pos.x - pos.width / 2,
        y: pos.y - pos.height / 2,
      },
    };
  });
}
