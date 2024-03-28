import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { Node, Edge } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";
import { codeToGraph } from "./codeToGraph";
import { extractCommentData, mergeCommentData } from "./comments";
import { runLayout } from "./runLayout";
import Task from "./Task";
import { toGraphEdges } from "./toGraphEdges";
import { writeTextToEditor } from "./editor";

type PersistedStore = {
  text: string;
  code: string;
  nodes: Node[];
  edges: Edge[];
  values: Record<string, number>;
};

export const initialPersistedStore = {
  text: "",
  code: "",
  nodes: [],
  edges: [],
  values: {},
};

export const usePersistedStore = create<PersistedStore>()(
  subscribeWithSelector(
    persist((_set) => initialPersistedStore, {
      name: "pgm-chat",
    }),
  ),
);

export function useSetJs() {
  return useCallback(
    ({
      newCode,
      shouldWriteToEditor = true,
      shouldGetValues = false,
      isTextStreaming = false,
    }: {
      newCode: string;
      /** Whether or not code should be written into the editor */
      shouldWriteToEditor?: boolean;
      /** Whether or not to run the worker task and compute values */
      shouldGetValues?: boolean;
      /** Whether the text is streaming in right now */
      isTextStreaming?: boolean;
    }) => {
      // reset the graph
      if (newCode === "") {
        usePersistedStore.setState(
          {
            code: newCode,
            nodes: [],
            edges: [],
            values: {},
          },
          true,
        );
        return;
      }

      usePersistedStore.setState({ code: newCode });

      try {
        const graph = codeToGraph(newCode);
        // If the code is not empty, but nodes aren't parsing, bail out
        if (!graph.nodes.length) return;

        const comments = extractCommentData(newCode);
        const nodesWithCommentData = mergeCommentData(comments, graph);
        const edges = toGraphEdges(graph);

        const nodes = runLayout(nodesWithCommentData, edges, isTextStreaming);
        usePersistedStore.setState({ nodes, edges });

        if (shouldWriteToEditor) {
          writeTextToEditor(newCode);
        }

        if (shouldGetValues) {
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
        }
      } catch (err) {
        console.error(err);
      }
    },
    [],
  );
}

export function useSetVariableAtLineNumber() {
  const setJs = useSetJs();
  return useCallback(
    (varName: string, lineNumber: number, value: string) => {
      const js = usePersistedStore.getState().code;
      const lines = js.split("\n");
      const newLine = `const ${varName} = ${value};`;
      const newCode = lines
        .slice(0, lineNumber - 1)
        .concat(newLine)
        .concat(lines.slice(lineNumber))
        .join("\n");

      setJs({
        newCode,
        shouldWriteToEditor: true,
        shouldGetValues: true,
      });
    },
    [setJs],
  );
}
