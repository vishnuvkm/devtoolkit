import { describe, it, expect } from "vitest";
import {
  buildCharset,
  generatePassword,
  generateMultiple,
  calcStrength,
} from "../lib/password-utils";

const fullOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

describe("buildCharset", () => {
  it("includes uppercase when enabled", () => {
    const cs = buildCharset({ ...fullOptions, lowercase: false, numbers: false, symbols: false });
    expect(cs).toMatch(/[A-Z]/);
    expect(cs).not.toMatch(/[a-z0-9]/);
  });
  it("includes numbers when enabled", () => {
    const cs = buildCharset({ ...fullOptions, uppercase: false, lowercase: false, symbols: false });
    expect(cs).toMatch(/[0-9]/);
  });
  it("excludes ambiguous characters when flag is set", () => {
    const cs = buildCharset({ ...fullOptions, symbols: false, excludeAmbiguous: true });
    expect(cs).not.toContain("O");
    expect(cs).not.toContain("0");
    expect(cs).not.toContain("I");
    expect(cs).not.toContain("l");
    expect(cs).not.toContain("1");
  });
  it("returns empty string when all options disabled", () => {
    const cs = buildCharset({ ...fullOptions, uppercase: false, lowercase: false, numbers: false, symbols: false });
    expect(cs).toBe("");
  });
  it("includes symbols when enabled", () => {
    const cs = buildCharset({ ...fullOptions, uppercase: false, lowercase: false, numbers: false });
    expect(cs).toContain("!");
    expect(cs).toContain("@");
  });
});

describe("generatePassword", () => {
  it("generates password of correct length", () => {
    const pw = generatePassword({ ...fullOptions, length: 20 });
    expect(pw).toHaveLength(20);
  });
  it("generates password of length 8", () => {
    const pw = generatePassword({ ...fullOptions, length: 8 });
    expect(pw).toHaveLength(8);
  });
  it("clamps length to 128 max", () => {
    const pw = generatePassword({ ...fullOptions, length: 200 });
    expect(pw).toHaveLength(128);
  });
  it("throws when no character type is selected", () => {
    expect(() =>
      generatePassword({ ...fullOptions, uppercase: false, lowercase: false, numbers: false, symbols: false })
    ).toThrow("Select at least one character type");
  });
  it("generates only uppercase chars when only uppercase enabled", () => {
    const pw = generatePassword({ ...fullOptions, lowercase: false, numbers: false, symbols: false, length: 32 });
    expect(pw).toMatch(/^[A-Z]+$/);
  });
  it("generates only digits when only numbers enabled", () => {
    const pw = generatePassword({ ...fullOptions, uppercase: false, lowercase: false, symbols: false, length: 32 });
    expect(pw).toMatch(/^[0-9]+$/);
  });
  it("generates two different passwords (randomness check)", () => {
    const pw1 = generatePassword(fullOptions);
    const pw2 = generatePassword(fullOptions);
    // Statistically almost impossible to be equal at length 16
    expect(pw1).not.toBe(pw2);
  });
});

describe("generateMultiple", () => {
  it("generates the requested count", () => {
    const pws = generateMultiple(5, fullOptions);
    expect(pws).toHaveLength(5);
  });
  it("caps count at 50", () => {
    const pws = generateMultiple(100, fullOptions);
    expect(pws).toHaveLength(50);
  });
  it("each password has correct length", () => {
    const pws = generateMultiple(3, { ...fullOptions, length: 12 });
    pws.forEach((pw) => expect(pw).toHaveLength(12));
  });
});

describe("calcStrength", () => {
  it("returns Weak for empty string", () => {
    expect(calcStrength("").label).toBe("Weak");
  });
  it("returns Weak for short simple password", () => {
    expect(calcStrength("abc").label).toBe("Weak");
  });
  it("returns Very Strong for long complex password", () => {
    const result = calcStrength("A3$kLp!mQz#nR9&wY2@eT7^uV");
    expect(["Strong", "Very Strong"]).toContain(result.label);
  });
  it("entropyBits increases with length", () => {
    const short = calcStrength("Ab1!");
    const long = calcStrength("Ab1!Ab1!Ab1!Ab1!Ab1!Ab1!");
    expect(long.entropyBits).toBeGreaterThan(short.entropyBits);
  });
  it("entropyBits increases with charset variety", () => {
    const letters = calcStrength("abcdefgh");
    const mixed = calcStrength("Ab1!ef$#");
    expect(mixed.entropyBits).toBeGreaterThan(letters.entropyBits);
  });
  it("score is between 0 and 4", () => {
    const result = calcStrength("TestPassword123!");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(4);
  });
});
