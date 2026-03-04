export type ChangeDirection = "increase" | "decrease" | "unchanged";

export interface PercentChangeResult {
  change: number;
  direction: ChangeDirection;
}

/** Calculate X% of Y. e.g. percentOf(15, 80) = 12 */
export function percentOf(percent: number, total: number): number {
  return (percent / 100) * total;
}

/** What percent is X of Y? e.g. whatPercent(12, 80) = 15 */
export function whatPercent(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/** Percent change from X to Y. e.g. percentChange(80, 96) → { change: 20, direction: 'increase' } */
export function percentChange(from: number, to: number): PercentChangeResult {
  if (from === 0) return { change: 0, direction: "unchanged" };
  const raw = ((to - from) / Math.abs(from)) * 100;
  if (raw === 0) return { change: 0, direction: "unchanged" };
  return {
    change: Math.abs(raw),
    direction: raw > 0 ? "increase" : "decrease",
  };
}

/** Add X% to a value. e.g. addPercent(80, 20) = 96 */
export function addPercent(value: number, percent: number): number {
  return value + (value * percent) / 100;
}

/** Subtract X% from a value. e.g. subtractPercent(80, 20) = 64 */
export function subtractPercent(value: number, percent: number): number {
  return value - (value * percent) / 100;
}

/** Format a number removing trailing zeros, max 8 decimal places. Returns "—" for non-finite. */
export function formatNumber(n: number, maxDecimals = 8): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toFixed(maxDecimals)).toString();
}
