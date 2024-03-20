import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Node, Edge } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { jsToGraph, toGraphEdges } from "./jsToGraph";
import { extractComments, mergeCommentsWithNodes } from "./extractComments";
import { addPositionsToNodes } from "./addPositionsToNodes";
import Task from "./Task";

type PersistedStore = {
  text: string;
  squiggle: string;
  nodes: Node[];
  edges: Edge[];
  values: Record<string, number>;
};

export const usePersistedStore = create<PersistedStore>()(
  persist(
    (set) => ({
      text: "",
      squiggle: "",
      nodes: [],
      edges: [],
      values: {},
    }),
    {
      name: "pgm-chat",
    }
  )
);

export function useSetJs() {
  const { setNodes, setEdges, fitView } = useReactFlow();

  return useCallback(
    (newCode: string, shouldFitView = true) => {
      usePersistedStore.setState({ squiggle: newCode });
      try {
        const graph = jsToGraph(newCode);
        const comments = extractComments(newCode);
        const nodesWithCommentData = mergeCommentsWithNodes(comments, graph);
        const edges = toGraphEdges(graph);
        const nodes = addPositionsToNodes(nodesWithCommentData, edges);
        usePersistedStore.setState({ nodes, edges });
        setNodes(nodes);
        setEdges(edges);
        if (shouldFitView) fitView();

        const returnStatement = `\nreturn { ${graph.nodes
          .map((node) => node.varName)
          .join(", ")} }`;
        const codeWithRtn = newCode + returnStatement;

        const task = new Task();
        task.exe(codeWithRtn).then((res) => {
          usePersistedStore.setState({ values: res });
          task.destroy();
        });
      } catch (err) {
        console.error(err);
      }
    },
    [fitView, setEdges, setNodes]
  );
}

export function useSetVariableAtLineNumber() {
  const setJs = useSetJs();
  return useCallback(
    (varName: string, lineNumber: number, value: string) => {
      const js = usePersistedStore.getState().squiggle;
      const lines = js.split("\n");
      const newLine = `const ${varName} = ${value};`;
      const newJs = lines
        .slice(0, lineNumber - 1)
        .concat(newLine)
        .concat(lines.slice(lineNumber))
        .join("\n");

      setJs(newJs, false);
    },
    [setJs]
  );
}
