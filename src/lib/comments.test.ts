import { describe, test, expect } from "bun:test";
import { extractCommentData } from "./comments";

describe("extractCommentData", () => {
  test("should extract comments from a string and assign them to the next string", () => {
    const code = `// key1: value1\n// key2: value2\nconst a = 1;
// key3: value3\n// key4: value4\nconst b = 2;`;

    const result = extractCommentData(code.trim());
    expect(result).toEqual({
      2: { key1: "value1", key2: "value2" },
      5: { key3: "value3", key4: "value4" },
    });
  });

  test.todo("Should only match comments at the beginning of a line");
});
