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
      <RecordButton submitRecording={submitRecording} />
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
