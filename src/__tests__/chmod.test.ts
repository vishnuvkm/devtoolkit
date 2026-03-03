import { describe, it, expect } from "vitest";
import {
  groupToNumber,
  groupToSymbol,
  parseOctal,
  parseNumericString,
  toNumericString,
  toSymbolicString,
} from "@/lib/chmod";

describe("groupToNumber", () => {
  it("returns 7 for rwx", () => {
    expect(groupToNumber({ read: true, write: true, execute: true })).toBe(7);
  });
  it("returns 0 for ---", () => {
    expect(groupToNumber({ read: false, write: false, execute: false })).toBe(0);
  });
  it("returns 5 for r-x", () => {
    expect(groupToNumber({ read: true, write: false, execute: true })).toBe(5);
  });
  it("returns 6 for rw-", () => {
    expect(groupToNumber({ read: true, write: true, execute: false })).toBe(6);
  });
  it("returns 4 for r--", () => {
    expect(groupToNumber({ read: true, write: false, execute: false })).toBe(4);
  });
});

describe("groupToSymbol", () => {
  it("converts rwx", () => {
    expect(groupToSymbol({ read: true, write: true, execute: true })).toBe("rwx");
  });
  it("converts ---", () => {
    expect(groupToSymbol({ read: false, write: false, execute: false })).toBe("---");
  });
  it("converts r-x", () => {
    expect(groupToSymbol({ read: true, write: false, execute: true })).toBe("r-x");
  });
  it("converts -w-", () => {
    expect(groupToSymbol({ read: false, write: true, execute: false })).toBe("-w-");
  });
});

describe("parseOctal", () => {
  it("parses 7 as rwx", () => {
    expect(parseOctal(7)).toEqual({ read: true, write: true, execute: true });
  });
  it("parses 0 as ---", () => {
    expect(parseOctal(0)).toEqual({ read: false, write: false, execute: false });
  });
  it("parses 5 as r-x", () => {
    expect(parseOctal(5)).toEqual({ read: true, write: false, execute: true });
  });
  it("parses 6 as rw-", () => {
    expect(parseOctal(6)).toEqual({ read: true, write: true, execute: false });
  });
  it("parses 4 as r--", () => {
    expect(parseOctal(4)).toEqual({ read: true, write: false, execute: false });
  });
});

describe("parseNumericString", () => {
  it("parses '755'", () => {
    const p = parseNumericString("755");
    expect(p).not.toBeNull();
    expect(toNumericString(p!)).toBe("755");
  });
  it("parses '644'", () => {
    const p = parseNumericString("644");
    expect(p).not.toBeNull();
    expect(toNumericString(p!)).toBe("644");
  });
  it("parses '000'", () => {
    const p = parseNumericString("000");
    expect(p).not.toBeNull();
    expect(toNumericString(p!)).toBe("000");
  });
  it("parses '777'", () => {
    const p = parseNumericString("777");
    expect(p).not.toBeNull();
    expect(toNumericString(p!)).toBe("777");
  });
  it("returns null for letters", () => {
    expect(parseNumericString("abc")).toBeNull();
  });
  it("returns null for 4-digit input", () => {
    expect(parseNumericString("1234")).toBeNull();
  });
  it("returns null for octal-invalid digits (8, 9)", () => {
    expect(parseNumericString("899")).toBeNull();
  });
});

describe("toSymbolicString", () => {
  it("converts 755 to rwxr-xr-x", () => {
    expect(toSymbolicString(parseNumericString("755")!)).toBe("rwxr-xr-x");
  });
  it("converts 644 to rw-r--r--", () => {
    expect(toSymbolicString(parseNumericString("644")!)).toBe("rw-r--r--");
  });
  it("converts 600 to rw-------", () => {
    expect(toSymbolicString(parseNumericString("600")!)).toBe("rw-------");
  });
  it("converts 777 to rwxrwxrwx", () => {
    expect(toSymbolicString(parseNumericString("777")!)).toBe("rwxrwxrwx");
  });
  it("converts 000 to ---------", () => {
    expect(toSymbolicString(parseNumericString("000")!)).toBe("---------");
  });
});
