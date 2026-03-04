import { describe, it, expect } from "vitest";
import { convert, formatResult, getUnits, getCategories } from "../lib/unit-utils";

const approx = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;

describe("getCategories", () => {
  it("returns 7 categories", () => {
    expect(getCategories()).toHaveLength(7);
  });
});

describe("getUnits", () => {
  it("returns length units", () => {
    const units = getUnits("length");
    expect(units.length).toBeGreaterThan(5);
    expect(units.find((u) => u.id === "m")).toBeTruthy();
    expect(units.find((u) => u.id === "ft")).toBeTruthy();
  });
  it("returns data units including kib", () => {
    const units = getUnits("data");
    expect(units.find((u) => u.id === "kib")).toBeTruthy();
  });
});

describe("convert – length", () => {
  it("same unit returns same value", () => {
    expect(convert(42, "m", "m", "length")).toBe(42);
  });
  it("1 km = 1000 m", () => {
    expect(approx(convert(1, "km", "m", "length"), 1000)).toBe(true);
  });
  it("1 mile ≈ 1609.344 m", () => {
    expect(approx(convert(1, "mi", "m", "length"), 1609.344)).toBe(true);
  });
  it("1 inch ≈ 2.54 cm", () => {
    expect(approx(convert(1, "in", "cm", "length"), 2.54, 0.001)).toBe(true);
  });
  it("1 foot = 12 inches", () => {
    expect(approx(convert(1, "ft", "in", "length"), 12, 0.001)).toBe(true);
  });
  it("round-trip m → ft → m", () => {
    const v = 100;
    expect(approx(convert(convert(v, "m", "ft", "length"), "ft", "m", "length"), v, 0.001)).toBe(true);
  });
});

describe("convert – weight", () => {
  it("1 kg = 1000 g", () => {
    expect(approx(convert(1, "kg", "g", "weight"), 1000)).toBe(true);
  });
  it("1 lb ≈ 453.592 g", () => {
    expect(approx(convert(1, "lb", "g", "weight"), 453.592, 0.01)).toBe(true);
  });
  it("1 stone = 14 lb", () => {
    expect(approx(convert(1, "st", "lb", "weight"), 14, 0.01)).toBe(true);
  });
});

describe("convert – temperature", () => {
  it("0°C = 32°F", () => {
    expect(approx(convert(0, "c", "f", "temperature"), 32)).toBe(true);
  });
  it("100°C = 212°F", () => {
    expect(approx(convert(100, "c", "f", "temperature"), 212)).toBe(true);
  });
  it("0°C = 273.15 K", () => {
    expect(approx(convert(0, "c", "k", "temperature"), 273.15)).toBe(true);
  });
  it("-40°C = -40°F", () => {
    expect(approx(convert(-40, "c", "f", "temperature"), -40)).toBe(true);
  });
  it("round-trip °F → °C → °F", () => {
    const v = 98.6;
    expect(approx(convert(convert(v, "f", "c", "temperature"), "c", "f", "temperature"), v, 0.001)).toBe(true);
  });
});

describe("convert – area", () => {
  it("1 m² = 10000 cm²", () => {
    expect(approx(convert(1, "m2", "cm2", "area"), 10000, 0.01)).toBe(true);
  });
  it("1 ha = 10000 m²", () => {
    expect(approx(convert(1, "ha", "m2", "area"), 10000, 0.01)).toBe(true);
  });
});

describe("convert – volume", () => {
  it("1 L = 1000 mL", () => {
    expect(approx(convert(1, "l", "ml", "volume"), 1000)).toBe(true);
  });
  it("1 gal ≈ 3.785 L", () => {
    expect(approx(convert(1, "gal", "l", "volume"), 3.78541, 0.001)).toBe(true);
  });
});

describe("convert – speed", () => {
  it("1 m/s = 3.6 km/h", () => {
    expect(approx(convert(1, "mps", "kph", "speed"), 3.6, 0.001)).toBe(true);
  });
  it("100 kph ≈ 62.14 mph", () => {
    expect(approx(convert(100, "kph", "mph", "speed"), 62.137, 0.01)).toBe(true);
  });
});

describe("convert – data", () => {
  it("1 kb = 1000 b", () => {
    expect(approx(convert(1, "kb", "b", "data"), 1000)).toBe(true);
  });
  it("1 gb = 1000 mb", () => {
    expect(approx(convert(1, "gb", "mb", "data"), 1000)).toBe(true);
  });
  it("1 kib = 1024 b", () => {
    expect(approx(convert(1, "kib", "b", "data"), 1024)).toBe(true);
  });
  it("1 byte = 8 bits", () => {
    expect(approx(convert(1, "b", "bit", "data"), 8)).toBe(true);
  });
});

describe("formatResult", () => {
  it("formats integers cleanly", () => {
    expect(formatResult(1000)).toBe("1000");
  });
  it("formats zero", () => {
    expect(formatResult(0)).toBe("0");
  });
  it("handles NaN", () => {
    expect(formatResult(NaN)).toBe("—");
  });
  it("uses scientific for very small numbers", () => {
    const result = formatResult(1e-12);
    expect(result).toContain("e");
  });
  it("uses scientific for very large numbers", () => {
    const result = formatResult(1e16);
    expect(result).toContain("e");
  });
});
