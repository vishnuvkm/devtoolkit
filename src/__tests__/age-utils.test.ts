import { describe, it, expect } from "vitest";
import { calculateAge, formatAge } from "../lib/age-utils";

describe("calculateAge – basic cases", () => {
  it("returns null for empty string", () => {
    expect(calculateAge("")).toBeNull();
  });

  it("returns null for future date", () => {
    expect(calculateAge("2099-01-01", "2024-01-01")).toBeNull();
  });

  it("calculates 0 years on exact birthday", () => {
    const result = calculateAge("2024-01-15", "2024-01-15");
    expect(result).not.toBeNull();
    expect(result!.years).toBe(0);
    expect(result!.months).toBe(0);
    expect(result!.days).toBe(0);
    expect(result!.isToday).toBe(true);
  });

  it("calculates exactly 1 year", () => {
    const result = calculateAge("2000-06-15", "2001-06-15");
    expect(result).not.toBeNull();
    expect(result!.years).toBe(1);
    expect(result!.months).toBe(0);
    expect(result!.days).toBe(0);
  });

  it("calculates 10 years", () => {
    const result = calculateAge("2000-01-01", "2010-01-01");
    expect(result).not.toBeNull();
    expect(result!.years).toBe(10);
    expect(result!.months).toBe(0);
  });

  it("calculates years and months correctly", () => {
    const result = calculateAge("2000-01-01", "2001-04-01");
    expect(result).not.toBeNull();
    expect(result!.years).toBe(1);
    expect(result!.months).toBe(3);
  });

  it("handles age just before birthday", () => {
    const result = calculateAge("2000-06-15", "2001-06-14");
    expect(result).not.toBeNull();
    expect(result!.years).toBe(0);
    expect(result!.months).toBe(11);
  });
});

describe("calculateAge – totalDays", () => {
  it("1 day apart", () => {
    const result = calculateAge("2020-01-01", "2020-01-02");
    expect(result!.totalDays).toBe(1);
  });

  it("365 days for non-leap year", () => {
    const result = calculateAge("2019-01-01", "2020-01-01");
    expect(result!.totalDays).toBe(365);
  });

  it("366 days for leap year", () => {
    const result = calculateAge("2020-01-01", "2021-01-01");
    expect(result!.totalDays).toBe(366);
  });
});

describe("calculateAge – totalWeeks", () => {
  it("7 days = 1 week", () => {
    const result = calculateAge("2020-01-01", "2020-01-08");
    expect(result!.totalWeeks).toBe(1);
  });
  it("14 days = 2 weeks", () => {
    const result = calculateAge("2020-01-01", "2020-01-15");
    expect(result!.totalWeeks).toBe(2);
  });
});

describe("calculateAge – next birthday", () => {
  it("next birthday in the future", () => {
    const result = calculateAge("2000-12-25", "2024-01-01");
    expect(result).not.toBeNull();
    expect(result!.nextBirthdayDays).toBeGreaterThan(0);
    expect(result!.nextBirthdayDate).toContain("2024");
  });

  it("today is birthday — isToday true", () => {
    const result = calculateAge("2000-03-15", "2024-03-15");
    expect(result).not.toBeNull();
    expect(result!.isToday).toBe(true);
    expect(result!.nextBirthdayDays).toBe(0);
  });
});

describe("formatAge", () => {
  it("formats full years months days", () => {
    const result = calculateAge("1990-01-01", "2024-04-15");
    expect(result).not.toBeNull();
    const str = formatAge(result!);
    expect(str).toContain("year");
  });

  it("formats 0 days as '0 days'", () => {
    const result = calculateAge("2024-01-01", "2024-01-01");
    expect(result).not.toBeNull();
    expect(formatAge(result!)).toBe("0 days");
  });

  it("singular year", () => {
    const result = calculateAge("2023-01-01", "2024-01-01");
    expect(result).not.toBeNull();
    expect(formatAge(result!)).toContain("1 year");
  });
});
