export interface RegexMatch {
  value: string;
  index: number;
  groups: string[];
}

export function findMatches(
  pattern: string,
  flags: string,
  text: string
): { matches: RegexMatch[]; error: string | null } {
  if (!pattern.trim()) return { matches: [], error: null };
  try {
    const flagsWithG = flags.includes("g") ? flags : flags + "g";
    const re = new RegExp(pattern, flagsWithG);
    const result: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      result.push({ value: m[0], index: m.index, groups: Array.from(m.slice(1)) });
      if (m.index === re.lastIndex) re.lastIndex++; // prevent infinite loop on empty match
      if (result.length >= 500) break;
    }
    return { matches: result, error: null };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : "Invalid regex" };
  }
}
