import type { Edge } from "@xyflow/react";
import type { Graph } from "./codeToGraph";

export function toGraphEdges(graph: Graph): Edge[] {
  return graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    className: "animated-edge",
    style: {
      stroke: "#8b68ee",
      strokeWidth: 1,
      // strokeDasharray: "5,5"
    },
  }));
}
