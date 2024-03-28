"use client";

import { useChat } from "ai/react";
import { Send2 } from "iconsax-react";
import { useCallback, useEffect } from "react";
import { fixToolCallJson } from "~/lib/fixToolCallJson";
import {
  initialPersistedStore,
  usePersistedStore,
  useSetJs,
} from "~/lib/usePersistedStore";
import { NavIconButton } from "./NavIconButton";
import { RecordButton } from "./RecordButton";
import { Panel } from "@xyflow/react";
import { cn } from "~/lib/cn";
import { useClientStore } from "~/lib/useClientStore";

export function Chat() {
  const js = usePersistedStore((state) => state.code);
  const setJs = useSetJs();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    reload,
  } = useChat({
    onFinish() {
      console.log("onFinish() ran.");

      useClientStore.setState({ isTextStreaming: false });

      const newCode = usePersistedStore.getState().code;
      setJs({
        newCode,
        shouldGetValues: true,
        isTextStreaming: false,
      });
    },
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
          } catch (e) {
            // console.error(e);
          }

          break;
        }
      }
    }
  }

  useEffect(() => {
    if (Boolean(currentJs) && currentJs !== js) {
      setJs({
        newCode: currentJs,
        shouldWriteToEditor: true,
      });
    }
  }, [currentJs, js, setJs]);

  const submitRecording = useCallback(
    (text: string) => {
      setMessages([
        {
          id: "1",
          role: "user",
          content: text,
        },
      ]);
      reload().catch(console.error);
    },
    [reload, setMessages],
  );

  return (
    <Panel
      position="top-center"
      className={cn(
        "!mx-0 !my-2 grid w-full max-w-sm select-none overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 shadow shadow-[black] md:max-w-lg",
        {
          "tc-panel-loading": isLoading,
        },
      )}
    >
      <div className="flex items-center">
        <form
          onSubmit={(e) => {
            usePersistedStore.setState(initialPersistedStore, true);
            useClientStore.setState({ isTextStreaming: true });
            handleSubmit(e);
          }}
          className="flex flex-grow gap-1 bg-transparent p-1"
        >
          <div className="hidden shrink-0 sm:block">
            {isLoading ? (
              <div className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center overflow-hidden rounded-full bg-brand-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={42}
                  height={42}
                  className="fill-purple-600"
                  viewBox="0 0 24 24"
                >
                  <style>
                    {"@keyframes spinner_svv2{to{transform:rotate(360deg)}}"}
                  </style>
                  <path
                    d="M10.14 1.16a11 11 0 0 0-9 8.92A1.59 1.59 0 0 0 2.46 12a1.52 1.52 0 0 0 1.65-1.3 8 8 0 0 1 6.66-6.61A1.42 1.42 0 0 0 12 2.69a1.57 1.57 0 0 0-1.86-1.53Z"
                    style={{
                      transformOrigin: "center",
                      animation: "spinner_svv2 1s infinite linear",
                    }}
                  />
                </svg>
              </div>
            ) : (
              <RecordButton submitRecording={submitRecording} />
            )}
          </div>
          <input
            className="w-full rounded-md rounded-l-full bg-white/5 p-3 outline-none sm:rounded-l-md"
            value={input}
            placeholder="Enter a question..."
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
          <NavIconButton
            type="submit"
            icon={Send2}
            className="hover:text-brand"
          />
        </form>
      </div>
    </Panel>
  );
}
