"use client";

import { useReactFlow } from "@xyflow/react";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { fixToolCallJson } from "~/lib/fixToolCallJson";
import { usePersistedStore, useSetJs } from "~/lib/usePersistedStore";
import { FormatSquare } from "iconsax-react";

export function Chat() {
  const { fitView } = useReactFlow();
  const js = usePersistedStore((state) => state.code);
  const setJs = useSetJs();
  // const throttleSetJs = useCallback(throttle(setJs, 60), [setJs]);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialInput:
        "Estimate the daily revenue based on foot traffic and advertising effectiveness",
    });

  let currentJs = js;

  if (isLoading) {
    const asstMessages = messages.filter((m) => m.role === "assistant");
    const latestMessage = asstMessages[asstMessages.length - 1];
    if (latestMessage) {
      switch (typeof latestMessage.tool_calls) {
        case "string": {
          try {
            currentJs = fixToolCallJson(latestMessage.tool_calls);
            // if (js) {
            //   throttleSetJs(js);
            // }
          } catch (e) {
            // console.error(e);
          }

          break;
        }
      }
    }
  }

  useEffect(() => {
    if (currentJs !== js) {
      setJs(currentJs).catch(console.error);
    }
  }, [currentJs, js, setJs]);

  return (
    <form onSubmit={handleSubmit} className="grid">
      <textarea
        className="h-[140px] w-full resize-none p-2 outline-none"
        value={input}
        placeholder="Say something..."
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // find the form ancestor from this element
            const form = e.currentTarget.closest("form");
            if (!form) return;

            // submit the form
            form.requestSubmit();
          }
        }}
      />
    </form>
  );
}

// function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): T {
//   let time = Date.now();
//   return function (this: any, ...args: any[]) {
//     if (time + wait - Date.now() < 0) {
//       fn.apply(this, args);
//       time = Date.now();
//     }
//   } as T;
// }
