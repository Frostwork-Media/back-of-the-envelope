"use client";

import { useChat } from "ai/react";
import { Microphone2, Send2 } from "iconsax-react";
import { useEffect } from "react";
import { fixToolCallJson } from "~/lib/fixToolCallJson";
import { usePersistedStore, useSetJs } from "~/lib/usePersistedStore";
import { NavIconButton } from "./NavIconButton";

export function Chat() {
  const js = usePersistedStore((state) => state.code);
  const setJs = useSetJs();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-grow items-center bg-transparent px-1"
    >
      <NavIconButton
        icon={Microphone2}
        hoverClass="hover:text-yellow-500"
        type="button"
      />
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
      <NavIconButton type="submit" icon={Send2} hoverClass="hover:text-brand" />
    </form>
  );
}
