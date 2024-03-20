import { describe, test, expect } from "vitest";
import { extractComments } from "./extractComments";

describe("extractComments", () => {
  test("should extract comments from a string and assign them to the next string", () => {
    const code = `
      // key1: value1
      // key2: value2
      const a = 1;
      // key3: value3
      // key4: value4
      const b = 2;
    `;

    const result = extractComments(code.trim());
    expect(result).toEqual({
      2: { key1: "value1", key2: "value2" },
      5: { key3: "value3", key4: "value4" },
    });
  });

  test.todo("Should only match comments at the beginning of a line");
});
