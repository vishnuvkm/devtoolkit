import { describe, it, expect } from "vitest";
import { analyzeText } from "../lib/word-counter-utils";

describe("analyzeText", () => {
  it("returns zero analysis for empty string", () => {
    const result = analyzeText("");
    expect(result.words).toBe(0);
    expect(result.characters).toBe(0);
    expect(result.sentences).toBe(0);
    expect(result.paragraphs).toBe(0);
    expect(result.topWords).toHaveLength(0);
  });

  it("returns zero analysis for whitespace-only string", () => {
    const result = analyzeText("   \n  ");
    expect(result.words).toBe(0);
    expect(result.sentences).toBe(0);
  });

  it("counts words correctly", () => {
    const result = analyzeText("Hello world how are you");
    expect(result.words).toBe(5);
  });

  it("counts characters including spaces", () => {
    const result = analyzeText("Hello world");
    expect(result.characters).toBe(11);
  });

  it("counts characters without spaces", () => {
    const result = analyzeText("Hello world");
    expect(result.charactersNoSpaces).toBe(10);
  });

  it("counts a single sentence", () => {
    const result = analyzeText("Hello world.");
    expect(result.sentences).toBe(1);
  });

  it("counts multiple sentences", () => {
    const result = analyzeText("Hello world. How are you? I am fine!");
    expect(result.sentences).toBe(3);
  });

  it("counts paragraphs separated by blank lines", () => {
    const text = "First paragraph here.\n\nSecond paragraph here.";
    const result = analyzeText(text);
    expect(result.paragraphs).toBe(2);
  });

  it("treats single block as one paragraph", () => {
    const result = analyzeText("Just one paragraph of text.");
    expect(result.paragraphs).toBe(1);
  });

  it("calculates reading time for 200 words as 1 minute", () => {
    const text = Array(200).fill("word").join(" ");
    const result = analyzeText(text);
    expect(result.readingTimeMinutes).toBe(1);
  });

  it("reading time rounds up", () => {
    const text = Array(201).fill("word").join(" ");
    const result = analyzeText(text);
    expect(result.readingTimeMinutes).toBe(2);
  });

  it("counts unique words case-insensitively", () => {
    const result = analyzeText("Hello hello HELLO world");
    expect(result.uniqueWords).toBeGreaterThanOrEqual(1);
    // "hello" and "world" should be 2 unique words
    expect(result.uniqueWords).toBe(2);
  });

  it("excludes stop words from top words", () => {
    const result = analyzeText("the the the the JavaScript JavaScript code");
    const topWordsList = result.topWords.map((w) => w.word);
    expect(topWordsList).not.toContain("the");
    expect(topWordsList).toContain("javascript");
  });

  it("returns top words sorted by frequency", () => {
    const result = analyzeText("apple apple apple banana banana cherry");
    expect(result.topWords[0].word).toBe("apple");
    expect(result.topWords[0].count).toBe(3);
    expect(result.topWords[1].word).toBe("banana");
  });

  it("returns at most 5 top words", () => {
    const text = "alpha beta gamma delta epsilon zeta eta theta iota kappa";
    const result = analyzeText(text);
    expect(result.topWords.length).toBeLessThanOrEqual(5);
  });
});
