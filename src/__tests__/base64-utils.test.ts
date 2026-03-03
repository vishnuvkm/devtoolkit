import { describe, it, expect } from "vitest";
import { toBase64, fromBase64 } from "@/lib/base64-utils";

describe("toBase64", () => {
  it("encodes simple ASCII (standard)", () => {
    expect(toBase64("Hello, World!", false)).toBe("SGVsbG8sIFdvcmxkIQ==");
  });
  it("produces URL-safe output (no +, /, = chars)", () => {
    // Encode something that normally produces +, / in base64
    const result = toBase64("Hello, World!", true);
    expect(result).not.toContain("+");
    expect(result).not.toContain("/");
    expect(result).not.toContain("=");
  });
  it("encodes empty string to empty string", () => {
    expect(toBase64("", false)).toBe("");
  });
  it("encodes UTF-8 strings and round-trips back", () => {
    const input = "こんにちは";
    expect(fromBase64(toBase64(input, false))).toBe(input);
  });
});

describe("fromBase64", () => {
  it("decodes standard base64", () => {
    expect(fromBase64("SGVsbG8sIFdvcmxkIQ==")).toBe("Hello, World!");
  });
  it("decodes standard base64 without padding", () => {
    expect(fromBase64("SGVsbG8sIFdvcmxkIQ")).toBe("Hello, World!");
  });
  it("decodes URL-safe base64", () => {
    const urlSafe = toBase64("Hello, World!", true);
    expect(fromBase64(urlSafe)).toBe("Hello, World!");
  });
  it("round-trips arbitrary ASCII strings", () => {
    const input = "Testing 1 2 3 !@#$%^&*()";
    expect(fromBase64(toBase64(input, false))).toBe(input);
  });
  it("round-trips URL-safe encoding", () => {
    const input = "binary+data/test";
    expect(fromBase64(toBase64(input, true))).toBe(input);
  });
});
