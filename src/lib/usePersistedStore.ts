import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { Node, Edge } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";
import { codeToGraph } from "./codeToGraph";
import { extractCommentData, mergeCommentData } from "./comments";
import { addPositionsToNodes } from "./addPositionsToNodes";
import Task from "./Task";
import { toGraphEdges } from "./toGraphEdges";

type PersistedStore = {
  text: string;
  code: string;
  nodes: Node[];
  edges: Edge[];
  values: Record<string, number>;
};

export const usePersistedStore = create<PersistedStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        text: "",
        code: "",
        nodes: [],
        edges: [],
        values: {},
      }),
      {
        name: "pgm-chat",
      },
    ),
  ),
);

export function useSetJs() {
  const { setNodes, setEdges, fitView } = useReactFlow();
  const isAnimating = useRef(false);

  return useCallback(
    async (newCode: string, shouldFitView = true) => {
      usePersistedStore.setState({ code: newCode });
      try {
        const graph = codeToGraph(newCode);
        if (!graph.nodes.length) return;

        const comments = extractCommentData(newCode);
        const nodesWithCommentData = mergeCommentData(comments, graph);
        const edges = toGraphEdges(graph);

        const nodes = await addPositionsToNodes(nodesWithCommentData, edges);
        usePersistedStore.setState({ nodes, edges });
        setNodes(nodes);
        setEdges(edges);
        if (shouldFitView && !isAnimating.current) {
          fitView({ duration: 300, maxZoom: 2 });
          isAnimating.current = true;
          setTimeout(() => {
            isAnimating.current = false;
          }, 301);
        }

        const returnStatement = `\nreturn { ${graph.nodes
          .map((node) => node.varName)
          .join(", ")} }`;
        const codeWithRtn = newCode + returnStatement;

        const task = new Task();
        task
          .exe(codeWithRtn)
          .then((res) => {
            usePersistedStore.setState({
              values: res as Record<string, number>,
            });
            task.destroy();
          })
          .catch((e) => {
            throw e;
          });
      } catch (err) {
        console.error(err);
      }
    },
    [fitView, setEdges, setNodes],
  );
}

export function useSetVariableAtLineNumber() {
  const setJs = useSetJs();
  return useCallback(
    (varName: string, lineNumber: number, value: string) => {
      const js = usePersistedStore.getState().code;
      const lines = js.split("\n");
      const newLine = `const ${varName} = ${value};`;
      const newJs = lines
        .slice(0, lineNumber - 1)
        .concat(newLine)
        .concat(lines.slice(lineNumber))
        .join("\n");

      setJs(newJs, false).catch((e) => {
        console.error(e);
      });
    },
    [setJs],
  );
}
