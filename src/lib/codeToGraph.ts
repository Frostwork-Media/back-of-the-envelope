import { parse } from "acorn";
import { simple } from "acorn-walk";

export type GraphNode = {
  varName: string;
  lineNumber: number;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

/**
 * This function parses a javascript with acorn and uses
 * the resulting AST to create a graph with the nodes and
 * edges of the code.
 */
export function codeToGraph(js: string): Graph {
  try {
    const ast = parse(js, { ecmaVersion: 2020, locations: true });

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const varToNode = new Map<string, GraphNode>();

    simple(ast, {
      VariableDeclaration(node) {
        for (const declaratorNode of node.declarations) {
          if (declaratorNode.id.type === "Identifier" && declaratorNode.init) {
            const varName = declaratorNode.id.name;
            const lineNumber = declaratorNode.loc?.start.line ?? 0;
            const varNode: GraphNode = { varName, lineNumber };
            nodes.push(varNode);
            varToNode.set(varName, varNode);

            // Traverse the init part for identifiers (variables)
            simple(declaratorNode.init, {
              Identifier(initNode) {
                if (varToNode.has(initNode.name)) {
                  // If the identifier is a known variable, add an edge
                  edges.push({ source: initNode.name, target: varName });
                }
              },
            });
          }
        }
      },
    });
    return { nodes, edges };
  } catch (e) {
    return { nodes: [], edges: [] };
  }
}
