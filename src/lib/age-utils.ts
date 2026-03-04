export interface AgeResult {
  years: number;
  months: number;
  days: number;           // remaining days after full months
  totalDays: number;
  totalWeeks: number;
  nextBirthdayDays: number;
  nextBirthdayDate: string; // e.g. "March 15, 2027"
  isToday: boolean;
}

/**
 * Calculate age from a birth date string (YYYY-MM-DD) relative to a reference date.
 * referenceDateStr defaults to today if omitted.
 * Returns null for invalid or future birth dates.
 */
export function calculateAge(
  birthDateStr: string,
  referenceDateStr?: string
): AgeResult | null {
  if (!birthDateStr) return null;

  // Parse as local midnight to avoid timezone shifts
  const [by, bm, bd] = birthDateStr.split("-").map(Number);
  if (!by || !bm || !bd) return null;
  const birth = new Date(by, bm - 1, bd);
  if (isNaN(birth.getTime())) return null;

  let ref: Date;
  if (referenceDateStr) {
    const [ry, rm, rd] = referenceDateStr.split("-").map(Number);
    ref = new Date(ry, rm - 1, rd);
  } else {
    const now = new Date();
    ref = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  if (birth > ref) return null; // future birth date

  // Calculate years
  let years = ref.getFullYear() - birth.getFullYear();
  const birthdayThisYear = new Date(ref.getFullYear(), bm - 1, bd);
  if (birthdayThisYear > ref) years--;

  // Calculate remaining months
  const afterYears = new Date(birth.getFullYear() + years, bm - 1, bd);
  let months = 0;
  let monthCursor = new Date(afterYears);
  while (true) {
    const next = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, bd);
    if (next > ref) break;
    months++;
    monthCursor = next;
  }

  // Remaining days
  const afterMonths = new Date(monthCursor);
  const days = Math.floor((ref.getTime() - afterMonths.getTime()) / 86400000);

  // Totals
  const totalDays = Math.floor((ref.getTime() - birth.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);

  // Next birthday
  let nextBirthday = new Date(ref.getFullYear(), bm - 1, bd);
  if (nextBirthday <= ref) {
    nextBirthday = new Date(ref.getFullYear() + 1, bm - 1, bd);
  }
  const nextBirthdayDays = Math.floor(
    (nextBirthday.getTime() - ref.getTime()) / 86400000
  );
  const nextBirthdayDate = nextBirthday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isToday = nextBirthdayDays === 0 ||
    (birthdayThisYear.getTime() === ref.getTime());

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    nextBirthdayDays: isToday ? 0 : nextBirthdayDays,
    nextBirthdayDate,
    isToday,
  };
}

export function formatAge(result: AgeResult): string {
  const parts: string[] = [];
  if (result.years > 0) parts.push(`${result.years} year${result.years !== 1 ? "s" : ""}`);
  if (result.months > 0) parts.push(`${result.months} month${result.months !== 1 ? "s" : ""}`);
  if (result.days > 0 || parts.length === 0) parts.push(`${result.days} day${result.days !== 1 ? "s" : ""}`);
  return parts.join(", ");
}
