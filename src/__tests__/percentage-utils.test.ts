import { describe, it, expect } from "vitest";
import {
  percentOf,
  whatPercent,
  percentChange,
  addPercent,
  subtractPercent,
  formatNumber,
} from "../lib/percentage-utils";

describe("percentOf", () => {
  it("calculates 15% of 80", () => {
    expect(percentOf(15, 80)).toBe(12);
  });
  it("handles 0%", () => {
    expect(percentOf(0, 100)).toBe(0);
  });
  it("handles 100%", () => {
    expect(percentOf(100, 50)).toBe(50);
  });
  it("handles decimal percent", () => {
    expect(percentOf(12.5, 200)).toBe(25);
  });
  it("handles decimal total", () => {
    expect(percentOf(50, 10.5)).toBeCloseTo(5.25);
  });
});

describe("whatPercent", () => {
  it("calculates what % 12 is of 80", () => {
    expect(whatPercent(12, 80)).toBe(15);
  });
  it("returns 0 when total is 0", () => {
    expect(whatPercent(5, 0)).toBe(0);
  });
  it("handles 100% case", () => {
    expect(whatPercent(50, 50)).toBe(100);
  });
  it("handles decimal results", () => {
    expect(whatPercent(1, 3)).toBeCloseTo(33.333);
  });
});

describe("percentChange", () => {
  it("calculates increase from 80 to 96", () => {
    const r = percentChange(80, 96);
    expect(r.change).toBe(20);
    expect(r.direction).toBe("increase");
  });
  it("calculates decrease from 100 to 75", () => {
    const r = percentChange(100, 75);
    expect(r.change).toBe(25);
    expect(r.direction).toBe("decrease");
  });
  it("returns unchanged for equal values", () => {
    expect(percentChange(50, 50).direction).toBe("unchanged");
  });
  it("returns unchanged when from is 0", () => {
    expect(percentChange(0, 100).direction).toBe("unchanged");
  });
  it("handles negative from value", () => {
    const r = percentChange(-50, -25);
    expect(r.direction).toBe("increase");
    expect(r.change).toBe(50);
  });
});

describe("addPercent", () => {
  it("adds 20% to 80 = 96", () => {
    expect(addPercent(80, 20)).toBe(96);
  });
  it("adds 0% changes nothing", () => {
    expect(addPercent(50, 0)).toBe(50);
  });
  it("adds 100% doubles the value", () => {
    expect(addPercent(40, 100)).toBe(80);
  });
});

describe("subtractPercent", () => {
  it("subtracts 20% from 80 = 64", () => {
    expect(subtractPercent(80, 20)).toBe(64);
  });
  it("subtracts 100% = 0", () => {
    expect(subtractPercent(50, 100)).toBe(0);
  });
  it("subtracts 0% changes nothing", () => {
    expect(subtractPercent(60, 0)).toBe(60);
  });
});

describe("formatNumber", () => {
  it("formats integer without decimals", () => {
    expect(formatNumber(12)).toBe("12");
  });
  it("removes trailing zeros", () => {
    expect(formatNumber(12.5)).toBe("12.5");
  });
  it("handles a precise decimal", () => {
    expect(formatNumber(33.33333333)).toBe("33.33333333");
  });
  it("returns em dash for NaN", () => {
    expect(formatNumber(NaN)).toBe("—");
  });
  it("returns em dash for Infinity", () => {
    expect(formatNumber(Infinity)).toBe("—");
  });
  it("returns em dash for -Infinity", () => {
    expect(formatNumber(-Infinity)).toBe("—");
  });
});
