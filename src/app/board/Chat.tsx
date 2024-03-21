"use client";

import { useChat } from "ai/react";
import { Send2 } from "iconsax-react";
import { useCallback, useEffect } from "react";
import { fixToolCallJson } from "~/lib/fixToolCallJson";
import { usePersistedStore, useSetJs } from "~/lib/usePersistedStore";
import { NavIconButton } from "./NavIconButton";
import { RecordButton } from "./RecordButton";

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
  } = useChat();

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
    if (currentJs !== js) {
      setJs(currentJs).catch(console.error);
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-grow gap-1 bg-transparent p-1"
    >
      {isLoading ? (
        <div className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center overflow-hidden rounded-full bg-brand/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={42}
            height={42}
            className="fill-red-400 blur-md"
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

      <input
        className="w-full rounded-md bg-white/5 p-3 outline-none"
        value={input}
        placeholder="If I walk 5 miles a day, how far do I walk in a week?"
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
      <NavIconButton type="submit" icon={Send2} className="hover:text-brand" />
    </form>
  );
}
