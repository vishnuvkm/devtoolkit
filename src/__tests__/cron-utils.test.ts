import { describe, it, expect } from "vitest";
import { parseField, getNextRuns } from "@/lib/cron-utils";

describe("parseField", () => {
  it("expands * to full range", () => {
    const result = parseField("*", 0, 4);
    expect([...result].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });
  it("parses step expression */5 within range", () => {
    const result = parseField("*/5", 0, 59);
    expect(result.has(0)).toBe(true);
    expect(result.has(5)).toBe(true);
    expect(result.has(30)).toBe(true);
    expect(result.has(55)).toBe(true);
    expect(result.has(3)).toBe(false);
    expect(result.has(7)).toBe(false);
  });
  it("parses a dash range", () => {
    const result = parseField("9-17", 0, 23);
    expect(result.has(9)).toBe(true);
    expect(result.has(13)).toBe(true);
    expect(result.has(17)).toBe(true);
    expect(result.has(8)).toBe(false);
    expect(result.has(18)).toBe(false);
  });
  it("parses a comma list", () => {
    const result = parseField("0,30", 0, 59);
    expect(result.has(0)).toBe(true);
    expect(result.has(30)).toBe(true);
    expect(result.has(15)).toBe(false);
    expect(result.size).toBe(2);
  });
  it("parses a single value", () => {
    const result = parseField("5", 0, 59);
    expect(result.has(5)).toBe(true);
    expect(result.size).toBe(1);
  });
  it("parses a range with step", () => {
    const result = parseField("9-17/2", 0, 23);
    expect(result.has(9)).toBe(true);
    expect(result.has(11)).toBe(true);
    expect(result.has(13)).toBe(true);
    expect(result.has(10)).toBe(false);
    expect(result.has(12)).toBe(false);
  });
});

describe("getNextRuns", () => {
  it("returns 5 results for a wildcard expression by default", () => {
    const runs = getNextRuns("* * * * *");
    expect(runs).toHaveLength(5);
  });
  it("returns exactly count results", () => {
    expect(getNextRuns("* * * * *", 1)).toHaveLength(1);
    expect(getNextRuns("* * * * *", 3)).toHaveLength(3);
    expect(getNextRuns("* * * * *", 10)).toHaveLength(10);
  });
  it("returns empty array for invalid expression", () => {
    expect(getNextRuns("invalid")).toEqual([]);
    expect(getNextRuns("* *")).toEqual([]);
    expect(getNextRuns("")).toEqual([]);
  });
  it("returns strings for all results", () => {
    const runs = getNextRuns("0 * * * *");
    runs.forEach((r) => expect(typeof r).toBe("string"));
    runs.forEach((r) => expect(r.length).toBeGreaterThan(0));
  });
});
