export function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const prefix = future ? "in " : "";
  const suffix = future ? "" : " ago";

  if (abs < 5000) return "just now";
  if (abs < 60_000) return `${prefix}${Math.floor(abs / 1000)}s${suffix}`;
  if (abs < 3_600_000) return `${prefix}${Math.floor(abs / 60_000)}m${suffix}`;
  if (abs < 86_400_000) return `${prefix}${Math.floor(abs / 3_600_000)}h${suffix}`;
  if (abs < 86_400_000 * 30) return `${prefix}${Math.floor(abs / 86_400_000)}d${suffix}`;
  if (abs < 86_400_000 * 365) return `${prefix}${Math.floor(abs / (86_400_000 * 30))}mo${suffix}`;
  return `${prefix}${Math.floor(abs / (86_400_000 * 365))}y${suffix}`;
}

export function parseTimestamp(input: string): { ms: number | null; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { ms: null, error: null };

  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    // 13+ digits = milliseconds, otherwise seconds
    const ms = trimmed.length >= 13 ? n : n * 1000;
    return { ms, error: null };
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return { ms: d.getTime(), error: null };

  return { ms: null, error: "Unrecognized format — try an epoch number or ISO date" };
}

export function formatInZone(ms: number, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    }).format(new Date(ms));
  } catch {
    return "—";
  }
}
