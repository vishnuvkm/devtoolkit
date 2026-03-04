export interface DateDiffResult {
  totalDays: number;
  workingDays: number;   // Mon–Fri inclusive
  weekendDays: number;
  totalWeeks: number;
  remainingDays: number; // totalDays % 7
  years: number;
  months: number;
  days: number;          // remaining after full months
  label: string;         // human-readable like "2 years, 3 months, 5 days"
  isNegative: boolean;   // true if end is before start (we show magnitude)
}

/**
 * Parse a YYYY-MM-DD string as local midnight (avoids timezone offset).
 */
function parseLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Count Mon–Fri days between two dates (inclusive on both ends, start <= end).
 */
export function countWorkingDays(start: Date, end: Date): number {
  if (start > end) return 0;
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getDay(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Compute a human-readable label from years/months/days.
 */
function buildLabel(years: number, months: number, days: number): string {
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  return parts.join(", ");
}

/**
 * Calculate the difference between two date strings (YYYY-MM-DD).
 * Returns null if either string is empty/invalid.
 * Automatically handles reversed order (sets isNegative).
 */
export function daysBetween(
  startStr: string,
  endStr: string
): DateDiffResult | null {
  if (!startStr || !endStr) return null;

  let start = parseLocal(startStr);
  let end = parseLocal(endStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const isNegative = end < start;
  if (isNegative) [start, end] = [end, start];

  const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const workingDays = countWorkingDays(start, end);
  const weekendDays = totalDays + 1 - workingDays; // +1 because countWorkingDays is inclusive

  // Compute years/months/days breakdown (same algorithm as age calculator)
  let years = end.getFullYear() - start.getFullYear();
  const startInEndYear = new Date(end.getFullYear(), start.getMonth(), start.getDate());
  if (startInEndYear > end) years--;

  const afterYears = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());
  let months = 0;
  let monthCursor = new Date(afterYears);
  while (true) {
    const next = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      start.getDate()
    );
    if (next > end) break;
    months++;
    monthCursor = next;
  }
  const days = Math.floor((end.getTime() - monthCursor.getTime()) / 86400000);

  return {
    totalDays,
    workingDays,
    weekendDays: Math.max(0, weekendDays),
    totalWeeks,
    remainingDays,
    years,
    months,
    days,
    label: buildLabel(years, months, days),
    isNegative,
  };
}
