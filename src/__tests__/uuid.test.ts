import { describe, it, expect } from "vitest";
import { generateUuids, isValidUuidV4, UUID_V4_REGEX } from "@/lib/uuid-utils";

describe("generateUuids", () => {
  it("generates the requested count", () => {
    expect(generateUuids(1, false)).toHaveLength(1);
    expect(generateUuids(5, false)).toHaveLength(5);
    expect(generateUuids(10, false)).toHaveLength(10);
  });
  it("generates lowercase UUIDs when uppercase=false", () => {
    const uuids = generateUuids(5, false);
    uuids.forEach((u) => expect(u).toBe(u.toLowerCase()));
  });
  it("generates uppercase UUIDs when uppercase=true", () => {
    const uuids = generateUuids(5, true);
    uuids.forEach((u) => expect(u).toBe(u.toUpperCase()));
  });
  it("generates unique values", () => {
    const uuids = generateUuids(20, false);
    const unique = new Set(uuids);
    expect(unique.size).toBe(20);
  });
  it("all generated UUIDs pass v4 validation", () => {
    generateUuids(20, false).forEach((u) => expect(isValidUuidV4(u)).toBe(true));
  });
  it("uppercase UUIDs also pass validation", () => {
    generateUuids(10, true).forEach((u) => expect(isValidUuidV4(u)).toBe(true));
  });
});

describe("isValidUuidV4", () => {
  it("accepts a valid v4 UUID", () => {
    expect(isValidUuidV4("f47ac10b-58cc-4372-a567-0e02b2c3d479")).toBe(true);
  });
  it("accepts uppercase v4 UUIDs", () => {
    expect(isValidUuidV4("F47AC10B-58CC-4372-A567-0E02B2C3D479")).toBe(true);
  });
  it("rejects a v1 UUID (version digit not 4)", () => {
    expect(isValidUuidV4("550e8400-e29b-11d4-a716-446655440000")).toBe(false);
  });
  it("rejects bad variant bits (not 8, 9, a, b)", () => {
    // c in position = invalid variant
    expect(isValidUuidV4("f47ac10b-58cc-4372-c567-0e02b2c3d479")).toBe(false);
  });
  it("rejects empty string", () => {
    expect(isValidUuidV4("")).toBe(false);
  });
  it("rejects a non-UUID string", () => {
    expect(isValidUuidV4("not-a-uuid")).toBe(false);
  });
  it("rejects UUID with wrong length", () => {
    expect(isValidUuidV4("f47ac10b-58cc-4372-a567-0e02b2c3d47")).toBe(false);
  });
});

describe("UUID_V4_REGEX", () => {
  it("matches the expected format", () => {
    expect(UUID_V4_REGEX.test("f47ac10b-58cc-4372-a567-0e02b2c3d479")).toBe(true);
    expect(UUID_V4_REGEX.test("00000000-0000-4000-8000-000000000000")).toBe(true);
  });
  it("requires version 4 in position 3", () => {
    expect(UUID_V4_REGEX.test("f47ac10b-58cc-3372-a567-0e02b2c3d479")).toBe(false);
    expect(UUID_V4_REGEX.test("f47ac10b-58cc-5372-a567-0e02b2c3d479")).toBe(false);
  });
  it("requires variant bits 8, 9, a, or b", () => {
    expect(UUID_V4_REGEX.test("f47ac10b-58cc-4372-0567-0e02b2c3d479")).toBe(false);
    expect(UUID_V4_REGEX.test("f47ac10b-58cc-4372-d567-0e02b2c3d479")).toBe(false);
  });
});
