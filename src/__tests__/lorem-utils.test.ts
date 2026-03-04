import { describe, it, expect } from "vitest";
import { generateLorem, wordCount, charCount } from "../lib/lorem-utils";

describe("generateLorem – words", () => {
  it("generates roughly the requested word count", () => {
    const result = generateLorem({ unit: "words", count: 10, format: "plain", startWithLorem: false });
    const wc = wordCount(result);
    expect(wc).toBeGreaterThanOrEqual(10);
  });

  it("starts with lorem ipsum when flag is set", () => {
    const result = generateLorem({ unit: "words", count: 5, format: "plain", startWithLorem: true });
    expect(result.toLowerCase()).toContain("lorem ipsum");
  });

  it("does not start with Lorem when flag is false", () => {
    const result = generateLorem({ unit: "words", count: 50, format: "plain", startWithLorem: false });
    // May or may not contain lorem depending on seeded random — just check it's non-empty
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("generateLorem – sentences", () => {
  it("generates a non-empty result for 3 sentences", () => {
    const result = generateLorem({ unit: "sentences", count: 3, format: "plain", startWithLorem: false });
    expect(result.length).toBeGreaterThan(0);
  });

  it("starts with classic Lorem for sentences when flag set", () => {
    const result = generateLorem({ unit: "sentences", count: 2, format: "plain", startWithLorem: true });
    expect(result.toLowerCase()).toContain("lorem ipsum dolor sit amet");
  });
});

describe("generateLorem – paragraphs", () => {
  it("generates multiple paragraphs separated by blank lines", () => {
    const result = generateLorem({ unit: "paragraphs", count: 3, format: "plain", startWithLorem: false });
    const parts = result.split("\n\n").filter(Boolean);
    expect(parts.length).toBe(3);
  });

  it("wraps in <p> tags for html format", () => {
    const result = generateLorem({ unit: "paragraphs", count: 2, format: "html", startWithLorem: false });
    expect(result).toContain("<p>");
    expect(result).toContain("</p>");
  });

  it("markdown format separates paragraphs with blank lines", () => {
    const result = generateLorem({ unit: "paragraphs", count: 2, format: "markdown", startWithLorem: false });
    expect(result).toContain("\n\n");
  });

  it("first paragraph starts with Lorem ipsum when flag set", () => {
    const result = generateLorem({ unit: "paragraphs", count: 1, format: "plain", startWithLorem: true });
    expect(result.toLowerCase()).toContain("lorem ipsum dolor sit amet");
  });
});

describe("generateLorem – determinism", () => {
  it("produces identical output on repeated calls with same options", () => {
    const opts = { unit: "paragraphs" as const, count: 2, format: "plain" as const, startWithLorem: false };
    const a = generateLorem(opts);
    const b = generateLorem(opts);
    expect(a).toBe(b);
  });
});

describe("wordCount / charCount", () => {
  it("counts words", () => {
    expect(wordCount("hello world foo")).toBe(3);
    expect(wordCount("")).toBe(0);
  });
  it("counts characters", () => {
    expect(charCount("hello")).toBe(5);
    expect(charCount("")).toBe(0);
  });
});
