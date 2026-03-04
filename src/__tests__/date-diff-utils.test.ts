import { describe, it, expect } from "vitest";
import { daysBetween, countWorkingDays } from "../lib/date-diff-utils";

describe("daysBetween – basic", () => {
  it("returns null for empty strings", () => {
    expect(daysBetween("", "2024-01-01")).toBeNull();
    expect(daysBetween("2024-01-01", "")).toBeNull();
    expect(daysBetween("", "")).toBeNull();
  });

  it("same date = 0 days", () => {
    const r = daysBetween("2024-01-01", "2024-01-01");
    expect(r).not.toBeNull();
    expect(r!.totalDays).toBe(0);
    expect(r!.years).toBe(0);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
    expect(r!.label).toBe("0 days");
  });

  it("1 day apart", () => {
    const r = daysBetween("2024-01-01", "2024-01-02");
    expect(r!.totalDays).toBe(1);
  });

  it("365 days (non-leap year)", () => {
    const r = daysBetween("2019-01-01", "2020-01-01");
    expect(r!.totalDays).toBe(365);
  });

  it("366 days (leap year 2020)", () => {
    const r = daysBetween("2020-01-01", "2021-01-01");
    expect(r!.totalDays).toBe(366);
  });
});

describe("daysBetween – isNegative (reversed dates)", () => {
  it("handles end before start", () => {
    const r = daysBetween("2024-12-31", "2024-01-01");
    expect(r).not.toBeNull();
    expect(r!.isNegative).toBe(true);
    expect(r!.totalDays).toBeGreaterThan(0);
  });

  it("normal order not negative", () => {
    const r = daysBetween("2024-01-01", "2024-12-31");
    expect(r!.isNegative).toBe(false);
  });
});

describe("daysBetween – totalWeeks + remainingDays", () => {
  it("7 days = 1 week, 0 remaining", () => {
    const r = daysBetween("2024-01-01", "2024-01-08");
    expect(r!.totalDays).toBe(7);
    expect(r!.totalWeeks).toBe(1);
    expect(r!.remainingDays).toBe(0);
  });

  it("10 days = 1 week, 3 remaining", () => {
    const r = daysBetween("2024-01-01", "2024-01-11");
    expect(r!.totalDays).toBe(10);
    expect(r!.totalWeeks).toBe(1);
    expect(r!.remainingDays).toBe(3);
  });
});

describe("daysBetween – years/months/days breakdown", () => {
  it("exactly 1 year", () => {
    const r = daysBetween("2020-06-15", "2021-06-15");
    expect(r!.years).toBe(1);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
  });

  it("1 year 3 months", () => {
    const r = daysBetween("2020-01-01", "2021-04-01");
    expect(r!.years).toBe(1);
    expect(r!.months).toBe(3);
  });

  it("label contains year", () => {
    const r = daysBetween("2020-01-01", "2021-04-01");
    expect(r!.label).toContain("year");
    expect(r!.label).toContain("month");
  });
});

describe("countWorkingDays", () => {
  it("Mon–Fri 5-day week = 5 working days", () => {
    // 2024-01-01 is Monday, 2024-01-05 is Friday
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 5);
    expect(countWorkingDays(start, end)).toBe(5);
  });

  it("full week Mon–Sun = 5 working days", () => {
    // Mon Jan 1 to Sun Jan 7
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 7);
    expect(countWorkingDays(start, end)).toBe(5);
  });

  it("start > end returns 0", () => {
    const start = new Date(2024, 0, 7);
    const end = new Date(2024, 0, 1);
    expect(countWorkingDays(start, end)).toBe(0);
  });

  it("same day on a weekday = 1", () => {
    const d = new Date(2024, 0, 1); // Monday
    expect(countWorkingDays(d, d)).toBe(1);
  });

  it("same day on a weekend = 0", () => {
    const d = new Date(2024, 0, 6); // Saturday
    expect(countWorkingDays(d, d)).toBe(0);
  });
});
