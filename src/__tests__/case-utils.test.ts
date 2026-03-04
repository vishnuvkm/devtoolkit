import { describe, it, expect } from "vitest";
import { convertCase, convertAll, CASE_OPTIONS } from "../lib/case-utils";

const INPUT = "hello world";
const CAMEL_INPUT = "helloWorldTest";
const SNAKE_INPUT = "hello_world_test";
const KEBAB_INPUT = "hello-world-test";

describe("convertCase – upper/lower", () => {
  it("converts to UPPER CASE", () => {
    expect(convertCase(INPUT, "upper")).toBe("HELLO WORLD");
  });
  it("converts to lower case", () => {
    expect(convertCase("HELLO WORLD", "lower")).toBe("hello world");
  });
});

describe("convertCase – title/sentence", () => {
  it("converts to Title Case", () => {
    expect(convertCase(INPUT, "title")).toBe("Hello World");
  });
  it("converts to Sentence case", () => {
    expect(convertCase("hello world test", "sentence")).toBe("Hello world test");
  });
});

describe("convertCase – camel/pascal", () => {
  it("converts to camelCase from spaces", () => {
    expect(convertCase(INPUT, "camel")).toBe("helloWorld");
  });
  it("converts to camelCase from snake_case", () => {
    expect(convertCase(SNAKE_INPUT, "camel")).toBe("helloWorldTest");
  });
  it("converts to PascalCase from spaces", () => {
    expect(convertCase(INPUT, "pascal")).toBe("HelloWorld");
  });
  it("converts to PascalCase from camelCase", () => {
    expect(convertCase(CAMEL_INPUT, "pascal")).toBe("HelloWorldTest");
  });
});

describe("convertCase – snake/kebab/constant/slug", () => {
  it("converts to snake_case", () => {
    expect(convertCase(INPUT, "snake")).toBe("hello_world");
  });
  it("converts to snake_case from camelCase", () => {
    expect(convertCase(CAMEL_INPUT, "snake")).toBe("hello_world_test");
  });
  it("converts to kebab-case", () => {
    expect(convertCase(INPUT, "kebab")).toBe("hello-world");
  });
  it("converts to kebab-case from snake_case", () => {
    expect(convertCase(SNAKE_INPUT, "kebab")).toBe("hello-world-test");
  });
  it("converts to CONSTANT_CASE", () => {
    expect(convertCase(INPUT, "constant")).toBe("HELLO_WORLD");
  });
  it("converts to slug", () => {
    expect(convertCase("Hello World! 2024", "slug")).toBe("hello-world-2024");
  });
});

describe("convertCase – edge cases", () => {
  it("returns empty string for empty input", () => {
    expect(convertCase("", "camel")).toBe("");
  });
  it("handles single word", () => {
    expect(convertCase("hello", "pascal")).toBe("Hello");
  });
  it("handles already-converted input", () => {
    expect(convertCase(KEBAB_INPUT, "camel")).toBe("helloWorldTest");
  });
});

describe("convertAll", () => {
  it("returns results for all case types", () => {
    const result = convertAll(INPUT);
    expect(Object.keys(result)).toHaveLength(CASE_OPTIONS.length);
    expect(result.camel).toBe("helloWorld");
    expect(result.pascal).toBe("HelloWorld");
    expect(result.snake).toBe("hello_world");
    expect(result.constant).toBe("HELLO_WORLD");
  });
});

describe("CASE_OPTIONS", () => {
  it("has 10 options", () => {
    expect(CASE_OPTIONS).toHaveLength(10);
  });
  it("all options have required fields", () => {
    for (const opt of CASE_OPTIONS) {
      expect(opt.type).toBeTruthy();
      expect(opt.label).toBeTruthy();
      expect(opt.example).toBeTruthy();
    }
  });
});
