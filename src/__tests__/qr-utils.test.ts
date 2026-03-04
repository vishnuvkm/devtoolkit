import { describe, it, expect } from "vitest";
import { isValidQrInput, getCharCount, MAX_QR_CHARS, ERROR_CORRECTION_LABELS } from "../lib/qr-utils";

describe("isValidQrInput", () => {
  it("returns true for non-empty text", () => {
    expect(isValidQrInput("hello")).toBe(true);
  });
  it("returns false for empty string", () => {
    expect(isValidQrInput("")).toBe(false);
  });
  it("returns false for whitespace only", () => {
    expect(isValidQrInput("   ")).toBe(false);
  });
  it("returns true for URL", () => {
    expect(isValidQrInput("https://devtoolkit.dev")).toBe(true);
  });
  it("returns false when text exceeds MAX_QR_CHARS", () => {
    expect(isValidQrInput("a".repeat(MAX_QR_CHARS + 1))).toBe(false);
  });
  it("returns true at exactly MAX_QR_CHARS", () => {
    expect(isValidQrInput("a".repeat(MAX_QR_CHARS))).toBe(true);
  });
});

describe("getCharCount", () => {
  it("counts characters correctly", () => {
    expect(getCharCount("hello")).toBe(5);
    expect(getCharCount("")).toBe(0);
  });
});

describe("constants", () => {
  it("MAX_QR_CHARS is 4296", () => {
    expect(MAX_QR_CHARS).toBe(4296);
  });
  it("ERROR_CORRECTION_LABELS has all 4 levels", () => {
    expect(Object.keys(ERROR_CORRECTION_LABELS)).toHaveLength(4);
    expect(ERROR_CORRECTION_LABELS.L).toContain("7%");
    expect(ERROR_CORRECTION_LABELS.H).toContain("30%");
  });
});
