import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  parseColorInput,
  findNearestTailwind,
} from "../lib/color-utils";

describe("hexToRgb", () => {
  it("parses a 6-digit hex", () => {
    expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
  });

  it("parses without # prefix", () => {
    expect(hexToRgb("3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
  });

  it("expands 3-digit hex", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("returns null for invalid hex", () => {
    expect(hexToRgb("#gggggg")).toBeNull();
    expect(hexToRgb("#12345")).toBeNull();
    expect(hexToRgb("xyz")).toBeNull();
  });
});

describe("rgbToHex", () => {
  it("converts known values", () => {
    expect(rgbToHex({ r: 59, g: 130, b: 246 })).toBe("#3b82f6");
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe("#ffffff");
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex({ r: -1, g: 300, b: 128 })).toBe("#00ff80");
  });
});

describe("rgbToHsl", () => {
  it("converts red", () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("converts white", () => {
    const hsl = rgbToHsl({ r: 255, g: 255, b: 255 });
    expect(hsl.l).toBe(100);
    expect(hsl.s).toBe(0);
  });

  it("converts black", () => {
    const hsl = rgbToHsl({ r: 0, g: 0, b: 0 });
    expect(hsl.l).toBe(0);
  });

  it("converts blue", () => {
    const hsl = rgbToHsl({ r: 0, g: 0, b: 255 });
    expect(hsl.h).toBe(240);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });
});

describe("hslToRgb", () => {
  it("converts achromatic (grey)", () => {
    const rgb = hslToRgb({ h: 0, s: 0, l: 50 });
    expect(rgb.r).toBe(rgb.g);
    expect(rgb.g).toBe(rgb.b);
  });

  it("converts red", () => {
    const rgb = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it("is inverse of rgbToHsl (round-trip)", () => {
    const original = { r: 59, g: 130, b: 246 };
    const hsl = rgbToHsl(original);
    const back = hslToRgb(hsl);
    // Allow ±2 rounding tolerance
    expect(Math.abs(back.r - original.r)).toBeLessThanOrEqual(2);
    expect(Math.abs(back.g - original.g)).toBeLessThanOrEqual(2);
    expect(Math.abs(back.b - original.b)).toBeLessThanOrEqual(2);
  });
});

describe("parseColorInput", () => {
  it("returns null for empty string", () => {
    expect(parseColorInput("")).toBeNull();
    expect(parseColorInput("   ")).toBeNull();
  });

  it("parses hex with #", () => {
    const result = parseColorInput("#3b82f6");
    expect(result).not.toBeNull();
    expect(result!.hex).toBe("#3b82f6");
    expect(result!.rgb).toEqual({ r: 59, g: 130, b: 246 });
  });

  it("parses hex without #", () => {
    const result = parseColorInput("3b82f6");
    expect(result).not.toBeNull();
    expect(result!.hex).toBe("#3b82f6");
  });

  it("parses rgb() notation", () => {
    const result = parseColorInput("rgb(59, 130, 246)");
    expect(result).not.toBeNull();
    expect(result!.hex).toBe("#3b82f6");
  });

  it("parses rgba() notation (ignores alpha)", () => {
    const result = parseColorInput("rgba(59, 130, 246, 0.5)");
    expect(result).not.toBeNull();
    expect(result!.rgb.r).toBe(59);
  });

  it("parses hsl() notation", () => {
    const result = parseColorInput("hsl(217, 91%, 60%)");
    expect(result).not.toBeNull();
    expect(result!.hsl.h).toBe(217);
    expect(result!.hsl.s).toBe(91);
    expect(result!.hsl.l).toBe(60);
  });

  it("returns null for garbage input", () => {
    expect(parseColorInput("not-a-color")).toBeNull();
    expect(parseColorInput("#gggggg")).toBeNull();
  });
});

describe("findNearestTailwind", () => {
  it("finds blue-500 for #3b82f6", () => {
    const nearest = findNearestTailwind({ r: 59, g: 130, b: 246 });
    expect(nearest).toBe("blue-500");
  });

  it("finds black for pure black", () => {
    const nearest = findNearestTailwind({ r: 0, g: 0, b: 0 });
    expect(nearest).toBe("black");
  });

  it("finds white for pure white", () => {
    const nearest = findNearestTailwind({ r: 255, g: 255, b: 255 });
    expect(nearest).toBe("white");
  });

  it("returns a string (not null) for any valid color", () => {
    const nearest = findNearestTailwind({ r: 128, g: 64, b: 192 });
    expect(typeof nearest).toBe("string");
    expect(nearest!.length).toBeGreaterThan(0);
  });
});
