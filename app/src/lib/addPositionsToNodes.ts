import type { Node, Edge } from "@xyflow/react";
import dagre from "dagre";

/**
 * Given nodes and edges, uses dagre to determine the positions
 */
export function addPositionsToNodes(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    marginx: 80,
    marginy: 200,
    nodesep: 40,
    ranksep: 130,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 240, height: 100 });
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
