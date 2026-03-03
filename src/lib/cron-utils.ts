// Parse a single cron field (e.g. "* /5", "1-5", "0,30", "*") into a Set of
// matching integer values within [min, max].
export function parseField(field: string, min: number, max: number): Set<number> {
  const values = new Set<number>();
  if (field === "*") {
    for (let i = min; i <= max; i++) values.add(i);
    return values;
  }
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepNum = parseInt(step);
      const [start, end] =
        range === "*" ? [min, max] : range.split("-").map(Number);
      for (let i = start; i <= (end ?? max); i += stepNum) values.add(i);
    } else if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) values.add(i);
    } else {
      const n = parseInt(part);
      if (!isNaN(n)) values.add(n);
    }
  }
  return values;
}

/** Return the next `count` formatted execution times for a cron expression. */
export function getNextRuns(expr: string, count = 5): string[] {
  try {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const [minuteExpr, hourExpr, domExpr, monthExpr, dowExpr] = parts;

    const minutes = parseField(minuteExpr, 0, 59);
    const hours = parseField(hourExpr, 0, 23);
    const doms = domExpr === "*" ? null : parseField(domExpr, 1, 31);
    const months = parseField(monthExpr, 1, 12);
    const dows = dowExpr === "*" ? null : parseField(dowExpr, 0, 7);

    const results: string[] = [];
    const cursor = new Date();
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    let iterations = 0;
    while (results.length < count && iterations < 100_000) {
      iterations++;
      const month = cursor.getMonth() + 1;
      const dom = cursor.getDate();
      const dow = cursor.getDay();
      const hour = cursor.getHours();
      const minute = cursor.getMinutes();

      const monthOk = months.has(month);
      const domOk = doms === null || doms.has(dom);
      const dowOk =
        dows === null || dows.has(dow) || dows.has(dow === 0 ? 7 : dow);
      const hourOk = hours.has(hour);
      const minuteOk = minutes.has(minute);

      if (monthOk && domOk && dowOk && hourOk && minuteOk) {
        results.push(
          cursor.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return results;
  } catch {
    return [];
  }
}
