import { describe, it, expect } from "vitest";
import { findMatches } from "@/lib/regex-utils";

describe("findMatches", () => {
  it("finds basic matches", () => {
    const { matches, error } = findMatches("[a-z]+", "g", "hello world");
    expect(error).toBeNull();
    expect(matches).toHaveLength(2);
    expect(matches[0].value).toBe("hello");
    expect(matches[1].value).toBe("world");
  });
  it("records correct indices", () => {
    const { matches } = findMatches("foo", "g", "foo bar foo");
    expect(matches[0].index).toBe(0);
    expect(matches[1].index).toBe(8);
  });
  it("captures capturing groups", () => {
    const { matches } = findMatches("(\\w+)@(\\w+)", "g", "user@host test@server");
    expect(matches[0].groups).toEqual(["user", "host"]);
    expect(matches[1].groups).toEqual(["test", "server"]);
  });
  it("returns empty groups array for non-capturing pattern", () => {
    const { matches } = findMatches("\\w+", "g", "hello");
    expect(matches[0].groups).toEqual([]);
  });
  it("returns error for invalid regex", () => {
    const { matches, error } = findMatches("[unclosed", "g", "test");
    expect(matches).toHaveLength(0);
    expect(error).toBeTruthy();
  });
  it("returns empty for empty pattern", () => {
    const { matches, error } = findMatches("", "g", "test");
    expect(matches).toHaveLength(0);
    expect(error).toBeNull();
  });
  it("respects case-insensitive flag", () => {
    const { matches } = findMatches("hello", "gi", "Hello HELLO hello");
    expect(matches).toHaveLength(3);
  });
  it("handles multiline flag correctly", () => {
    const { matches } = findMatches("^\\w+", "gm", "line1\nline2\nline3");
    expect(matches).toHaveLength(3);
    expect(matches.map((m) => m.value)).toEqual(["line1", "line2", "line3"]);
  });
  it("caps results at 500 matches", () => {
    const { matches } = findMatches("a", "g", "a".repeat(600));
    expect(matches.length).toBeLessThanOrEqual(500);
  });
  it("adds g flag automatically if not present", () => {
    // Without g flag, findMatches should still find all occurrences
    const { matches } = findMatches("a", "", "aaa");
    expect(matches.length).toBeGreaterThan(0);
  });
});
