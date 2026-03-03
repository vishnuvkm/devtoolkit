import { describe, it, expect } from "vitest";
import { timeAgo, parseTimestamp, formatInZone } from "@/lib/timestamp-utils";

describe("timeAgo", () => {
  it("returns 'just now' for very recent timestamps", () => {
    expect(timeAgo(Date.now() - 1000)).toBe("just now");
    expect(timeAgo(Date.now() + 1000)).toBe("just now");
  });
  it("handles past seconds", () => {
    expect(timeAgo(Date.now() - 30_000)).toBe("30s ago");
  });
  it("handles past minutes", () => {
    expect(timeAgo(Date.now() - 3 * 60_000)).toBe("3m ago");
  });
  it("handles past hours", () => {
    expect(timeAgo(Date.now() - 2 * 3_600_000)).toBe("2h ago");
  });
  it("handles past days", () => {
    expect(timeAgo(Date.now() - 3 * 86_400_000)).toBe("3d ago");
  });
  it("handles future seconds", () => {
    expect(timeAgo(Date.now() + 30_000)).toBe("in 30s");
  });
  it("handles future minutes", () => {
    expect(timeAgo(Date.now() + 5 * 60_000)).toBe("in 5m");
  });
  it("handles future hours", () => {
    expect(timeAgo(Date.now() + 4 * 3_600_000)).toBe("in 4h");
  });
});

describe("parseTimestamp", () => {
  it("parses unix seconds (10 digits)", () => {
    const { ms, error } = parseTimestamp("1700000000");
    expect(error).toBeNull();
    expect(ms).toBe(1700000000 * 1000);
  });
  it("parses unix milliseconds (13 digits)", () => {
    const { ms, error } = parseTimestamp("1700000000000");
    expect(error).toBeNull();
    expect(ms).toBe(1700000000000);
  });
  it("parses ISO date string", () => {
    const { ms, error } = parseTimestamp("2024-01-15T12:00:00Z");
    expect(error).toBeNull();
    expect(ms).toBe(new Date("2024-01-15T12:00:00Z").getTime());
  });
  it("returns error for unrecognized format", () => {
    const { ms, error } = parseTimestamp("not-a-date");
    expect(ms).toBeNull();
    expect(error).toBeTruthy();
  });
  it("returns nulls for empty input", () => {
    const { ms, error } = parseTimestamp("");
    expect(ms).toBeNull();
    expect(error).toBeNull();
  });
  it("distinguishes seconds from milliseconds by digit count", () => {
    const sec = parseTimestamp("1000000000");  // 10 digits → seconds
    const ms = parseTimestamp("1000000000000"); // 13 digits → milliseconds
    expect(sec.ms).toBe(1_000_000_000_000);
    expect(ms.ms).toBe(1_000_000_000_000);
  });
});

describe("formatInZone", () => {
  it("formats epoch 0 in UTC containing 1970", () => {
    const formatted = formatInZone(0, "UTC");
    expect(formatted).toContain("1970");
  });
  it("formats a known timestamp in IST", () => {
    // 2024-01-15 12:00:00 UTC
    const formatted = formatInZone(
      new Date("2024-01-15T12:00:00Z").getTime(),
      "Asia/Kolkata"
    );
    expect(formatted).toContain("2024");
    expect(formatted).toContain("Jan");
  });
  it("returns '—' for an invalid timezone", () => {
    expect(formatInZone(Date.now(), "Not/ATimezone")).toBe("—");
  });
});
