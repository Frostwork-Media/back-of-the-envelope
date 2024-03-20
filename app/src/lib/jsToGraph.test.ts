import { test, expect, describe } from "vitest";
import { jsToGraph } from "./jsToGraph";

describe("jsToGraph", () => {
  test("should create a node for each variable declaration", () => {
    const js = `const a = 1;\nconst b = 2;
    `;

    const graph = jsToGraph(js);

    expect(graph).toEqual({
      nodes: [
        { varName: "a", lineNumber: 1 },
        { varName: "b", lineNumber: 2 },
      ],
      edges: [],
    });
  });

  test("should create an edge if a variable is used by another", () => {
    const js = `const a = 1;
const b = a + 1;`;

    const graph = jsToGraph(js);

    expect(graph).toEqual({
      nodes: [
        { varName: "a", lineNumber: 1 },
        { varName: "b", lineNumber: 2 },
      ],
      edges: [{ source: "a", target: "b" }],
    });
  });

  test("should create multiple edges if variable references multiple variables", () => {
    const js = `
      const a = 1;
      const b = 2;
      const c = a + b;
    `;

    const graph = jsToGraph(js.trim());

    expect(graph).toEqual({
      nodes: [
        { varName: "a", lineNumber: 1 },
        { varName: "b", lineNumber: 2 },
        { varName: "c", lineNumber: 3 },
      ],
      edges: [
        { source: "a", target: "c" },
        { source: "b", target: "c" },
      ],
    });
  });
});
