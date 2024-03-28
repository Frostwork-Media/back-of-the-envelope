import type { Edge } from "@xyflow/react";
import type { Graph } from "./codeToGraph";

export function toGraphEdges(graph: Graph): Edge[] {
  return graph.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    className: "animated-edge",
    style: {
      stroke: "#734BDE",
      strokeWidth: 1,
    },
  }));
}
