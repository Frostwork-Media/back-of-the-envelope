import type { ToolCall } from "ai";
import { jsonrepair } from "jsonrepair";

export function fixToolCallJson(initial: string) {
  const result = JSON.parse(repair(initial)) as {
    tool_calls: ToolCall[];
  };

  const argsStr = result.tool_calls[0]?.function.arguments ?? "";

  if (argsStr) {
    const innerJson = JSON.parse(repair(argsStr)) as {
      js: string;
    };

    return innerJson?.js;
  }

  return initial;
}

function repair(s: string) {
  try {
    // try adding a double quote to the end (gives better results sometimes)
    const json = jsonrepair(s + '"');
    return json;
  } catch (e) {
    try {
      // try doing nothing
      const json = jsonrepair(s);
      return json;
    } catch (e) {
      try {
        // try deleting the last character
        const json = jsonrepair(s.slice(0, -1));
        return json;
      } catch (e) {
        try {
          // Try deleting the last line
          const json = jsonrepair(s.split("\n").slice(0, -1).join("\n"));
          return json;
        } catch (e) {
          // Give up
          return s;
        }
      }
    }
  }
}
