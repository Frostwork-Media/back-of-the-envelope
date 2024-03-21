import type { Graph } from "./codeToGraph";
import type { Node } from "@xyflow/react";

/**
 * Extracts comments from a javascript string,
 * builds lines matching a certain pattern into
 * objects, and assigns them to the following line.
 */
export function extractCommentData(codeStr: string) {
  // break it into strings
  const lines = codeStr.split("\n");

  const linesWithComments: Record<number, Record<string, string>> = {};
  let currentObject: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const match = /^\/\/ (?<key>\w+):(?<value>.*)/g.exec(line);
    if (match) {
      const { key = "", value = "" } = match.groups!;
      // add the key-value pair to the current object
      currentObject[key] = value.trim();
    } else {
      // if the line doesn't match the pattern, add the current object isn't empty
      // add it to the linesWithComments object
      if (Object.keys(currentObject).length > 0) {
        linesWithComments[i] = currentObject;
        currentObject = {};
      }
    }
  }

  return linesWithComments;
}

export function mergeCommentData(
  comments: ReturnType<typeof extractCommentData>,
  graph: Graph,
): Node[] {
  const mergedGraph = graph;
  const nodes: Node[] = mergedGraph.nodes.map((node) => {
    const commentData = comments[node.lineNumber - 1] || {};

    return {
      id: node.varName,
      position: { x: 0, y: 0 },
      type: "custom",
      data: {
        lineNumber: node.lineNumber,
        ...commentData,
        label: commentData["title"] ?? node.varName,
      },
    };
  });

  return nodes;
}
