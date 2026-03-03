export interface GroupPerms {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Permissions {
  owner: GroupPerms;
  group: GroupPerms;
  others: GroupPerms;
}

export function groupToNumber(g: GroupPerms): number {
  return (g.read ? 4 : 0) + (g.write ? 2 : 0) + (g.execute ? 1 : 0);
}

export function groupToSymbol(g: GroupPerms): string {
  return `${g.read ? "r" : "-"}${g.write ? "w" : "-"}${g.execute ? "x" : "-"}`;
}

export function parseOctal(n: number): GroupPerms {
  return { read: (n & 4) !== 0, write: (n & 2) !== 0, execute: (n & 1) !== 0 };
}

/** "755" → full Permissions object */
export function parseNumericString(value: string): Permissions | null {
  if (!/^[0-7]{3}$/.test(value)) return null;
  return {
    owner: parseOctal(parseInt(value[0])),
    group: parseOctal(parseInt(value[1])),
    others: parseOctal(parseInt(value[2])),
  };
}

/** Permissions → "755" */
export function toNumericString(p: Permissions): string {
  return `${groupToNumber(p.owner)}${groupToNumber(p.group)}${groupToNumber(p.others)}`;
}

/** Permissions → "rwxr-xr-x" */
export function toSymbolicString(p: Permissions): string {
  return `${groupToSymbol(p.owner)}${groupToSymbol(p.group)}${groupToSymbol(p.others)}`;
}
