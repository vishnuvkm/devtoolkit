import { describe, it, expect } from "vitest";
import { tools } from "@/lib/tools-registry";

const EXPECTED_SLUGS = [
  "cron-generator",
  "json-yaml",
  "jwt-decoder",
  "base64",
  "regex-tester",
  "chmod-calculator",
  "hash-generator",
  "uuid-generator",
  "url-parser",
  "timestamp-converter",
];

describe("tools registry", () => {
  it("contains all 10 expected tools", () => {
    const slugs = tools.map((t) => t.slug);
    EXPECTED_SLUGS.forEach((slug) => expect(slugs).toContain(slug));
  });
  it("has at least 10 tools total", () => {
    expect(tools.length).toBeGreaterThanOrEqual(10);
  });
  it("every tool has a non-empty slug", () => {
    tools.forEach((t) => {
      expect(t.slug).toBeTruthy();
      expect(typeof t.slug).toBe("string");
    });
  });
  it("every tool has a non-empty name and description", () => {
    tools.forEach((t) => {
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
    });
  });
  it("every tool has a valid wave number (1-4)", () => {
    tools.forEach((t) => {
      expect(t.wave).toBeGreaterThanOrEqual(1);
      expect(t.wave).toBeLessThanOrEqual(4);
    });
  });
  it("every tool has an icon string", () => {
    tools.forEach((t) => expect(typeof t.icon).toBe("string"));
  });
  it("relatedTools arrays reference valid slugs", () => {
    const slugSet = new Set(tools.map((t) => t.slug));
    tools.forEach((t) => {
      t.relatedTools.forEach((related) => {
        expect(slugSet.has(related)).toBe(true);
      });
    });
  });
  it("wave 1 tools exist", () => {
    const wave1 = tools.filter((t) => t.wave === 1);
    expect(wave1.length).toBeGreaterThan(0);
  });
  it("wave 2 tools exist", () => {
    const wave2 = tools.filter((t) => t.wave === 2);
    expect(wave2.length).toBeGreaterThan(0);
  });
  it("all slugs are unique", () => {
    const slugs = tools.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
