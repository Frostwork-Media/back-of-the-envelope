import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import App from "./App.tsx";
import "./index.css";
import { trpc } from "./lib/trpc";
import { queryClient, trpcClient } from "./lib/clients.ts";
import { QueryClientProvider } from "@tanstack/react-query";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
