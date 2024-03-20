import { trpc } from "./lib/trpc";
import { usePersistedStore, useSetJs } from "./lib/usePersistedStore";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Panel,
  PanelPosition,
} from "@xyflow/react";
import { CustomNode } from "./components/CustomNode";

const nodeTypes = {
  custom: CustomNode,
};
function App() {
  const text = usePersistedStore((state) => state.text);
  const squiggle = usePersistedStore((state) => state.squiggle);
  const { mutateAsync: createForecast, isLoading } =
    trpc.createForecast.useMutation();

  const nodes = usePersistedStore((state) => state.nodes);
  const edges = usePersistedStore((state) => state.edges);

  const setJs = useSetJs();

  return (
    <div className="h-screen grid grid-cols-[500px_minmax(0,1fr)]">
      <div className="grid grid-rows-[150px_80px_400px] p-1 bg-white border-r">
        <textarea
          placeholder="Describe what you would like to forecast..."
          className="p-4 outline-none resize-none"
          value={text}
          onChange={(e) => {
            usePersistedStore.setState({ text: e.target.value });
          }}
          disabled={isLoading}
        />
        <button
          className="p-2 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white text-lg rounded-xl"
          onClick={() =>
            createForecast({ text, squiggle }).then((res) => {
              setJs(res.js);
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Forecast"}
        </button>
        <textarea
          placeholder="Squiggle code appears here..."
          className="p-4 outline-none resize-none font-mono text-xs"
          value={squiggle}
          onChange={(e) => {
            setJs(e.target.value);
          }}
        />
      </div>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          for (const change of changes) {
            if (change.type === "position") {
              usePersistedStore.setState((state) => ({
                nodes: state.nodes.map((node) => {
                  if (node.id === change.id && change.position) {
                    return {
                      ...node,
                      position: change.position,
                    };
                  }
                  return node;
                }),
              }));
            }
          }
        }}
        fitView
      >
        <Background />
        {/* <Panel position="bottom-center">
          <button>Auto Layout</button>
        </Panel> */}
      </ReactFlow>
    </div>
  );
}

export default App;
