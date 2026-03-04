export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "data";

export interface UnitDef {
  id: string;
  label: string;
  toBase: (v: number) => number;   // to SI base unit
  fromBase: (v: number) => number; // from SI base unit
}

const UNITS: Record<UnitCategory, UnitDef[]> = {
  // base unit: meter
  length: [
    { id: "nm",  label: "Nanometers",  toBase: (v) => v * 1e-9,    fromBase: (v) => v / 1e-9 },
    { id: "um",  label: "Micrometers", toBase: (v) => v * 1e-6,    fromBase: (v) => v / 1e-6 },
    { id: "mm",  label: "Millimeters", toBase: (v) => v / 1000,    fromBase: (v) => v * 1000 },
    { id: "cm",  label: "Centimeters", toBase: (v) => v / 100,     fromBase: (v) => v * 100 },
    { id: "m",   label: "Meters",      toBase: (v) => v,           fromBase: (v) => v },
    { id: "km",  label: "Kilometers",  toBase: (v) => v * 1000,    fromBase: (v) => v / 1000 },
    { id: "in",  label: "Inches",      toBase: (v) => v * 0.0254,  fromBase: (v) => v / 0.0254 },
    { id: "ft",  label: "Feet",        toBase: (v) => v * 0.3048,  fromBase: (v) => v / 0.3048 },
    { id: "yd",  label: "Yards",       toBase: (v) => v * 0.9144,  fromBase: (v) => v / 0.9144 },
    { id: "mi",  label: "Miles",       toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { id: "nmi", label: "Nautical Miles", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  // base unit: kilogram
  weight: [
    { id: "mcg", label: "Micrograms",  toBase: (v) => v * 1e-9,    fromBase: (v) => v / 1e-9 },
    { id: "mg",  label: "Milligrams",  toBase: (v) => v * 1e-6,    fromBase: (v) => v / 1e-6 },
    { id: "g",   label: "Grams",       toBase: (v) => v / 1000,    fromBase: (v) => v * 1000 },
    { id: "kg",  label: "Kilograms",   toBase: (v) => v,           fromBase: (v) => v },
    { id: "t",   label: "Tonnes",      toBase: (v) => v * 1000,    fromBase: (v) => v / 1000 },
    { id: "oz",  label: "Ounces",      toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { id: "lb",  label: "Pounds",      toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { id: "st",  label: "Stone",       toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ],
  // base unit: Celsius (special — NOT linear from 0)
  temperature: [
    { id: "c", label: "Celsius",    toBase: (v) => v,               fromBase: (v) => v },
    { id: "f", label: "Fahrenheit", toBase: (v) => (v - 32) * 5/9,  fromBase: (v) => v * 9/5 + 32 },
    { id: "k", label: "Kelvin",     toBase: (v) => v - 273.15,      fromBase: (v) => v + 273.15 },
  ],
  // base unit: square meter
  area: [
    { id: "mm2", label: "Square Millimeters", toBase: (v) => v * 1e-6,     fromBase: (v) => v / 1e-6 },
    { id: "cm2", label: "Square Centimeters", toBase: (v) => v * 1e-4,     fromBase: (v) => v / 1e-4 },
    { id: "m2",  label: "Square Meters",      toBase: (v) => v,             fromBase: (v) => v },
    { id: "km2", label: "Square Kilometers",  toBase: (v) => v * 1e6,       fromBase: (v) => v / 1e6 },
    { id: "ha",  label: "Hectares",           toBase: (v) => v * 10000,     fromBase: (v) => v / 10000 },
    { id: "ac",  label: "Acres",              toBase: (v) => v * 4046.86,   fromBase: (v) => v / 4046.86 },
    { id: "in2", label: "Square Inches",      toBase: (v) => v * 6.4516e-4, fromBase: (v) => v / 6.4516e-4 },
    { id: "ft2", label: "Square Feet",        toBase: (v) => v * 0.092903,  fromBase: (v) => v / 0.092903 },
    { id: "yd2", label: "Square Yards",       toBase: (v) => v * 0.836127,  fromBase: (v) => v / 0.836127 },
    { id: "mi2", label: "Square Miles",       toBase: (v) => v * 2.59e6,    fromBase: (v) => v / 2.59e6 },
  ],
  // base unit: liter
  volume: [
    { id: "ml",   label: "Milliliters",  toBase: (v) => v / 1000,    fromBase: (v) => v * 1000 },
    { id: "cl",   label: "Centiliters",  toBase: (v) => v / 100,     fromBase: (v) => v * 100 },
    { id: "l",    label: "Liters",       toBase: (v) => v,           fromBase: (v) => v },
    { id: "m3",   label: "Cubic Meters", toBase: (v) => v * 1000,    fromBase: (v) => v / 1000 },
    { id: "tsp",  label: "Teaspoons",    toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
    { id: "tbsp", label: "Tablespoons",  toBase: (v) => v * 0.0147868,  fromBase: (v) => v / 0.0147868 },
    { id: "floz", label: "Fluid Ounces", toBase: (v) => v * 0.0295735,  fromBase: (v) => v / 0.0295735 },
    { id: "cup",  label: "Cups",         toBase: (v) => v * 0.236588,   fromBase: (v) => v / 0.236588 },
    { id: "pt",   label: "Pints",        toBase: (v) => v * 0.473176,   fromBase: (v) => v / 0.473176 },
    { id: "qt",   label: "Quarts",       toBase: (v) => v * 0.946353,   fromBase: (v) => v / 0.946353 },
    { id: "gal",  label: "Gallons",      toBase: (v) => v * 3.78541,    fromBase: (v) => v / 3.78541 },
  ],
  // base unit: meters per second
  speed: [
    { id: "mps",  label: "Meters/second",   toBase: (v) => v,          fromBase: (v) => v },
    { id: "kph",  label: "Km/hour",         toBase: (v) => v / 3.6,    fromBase: (v) => v * 3.6 },
    { id: "mph",  label: "Miles/hour",      toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { id: "fps",  label: "Feet/second",     toBase: (v) => v * 0.3048,  fromBase: (v) => v / 0.3048 },
    { id: "knot", label: "Knots",           toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    { id: "mach", label: "Mach",            toBase: (v) => v * 343,     fromBase: (v) => v / 343 },
  ],
  // base unit: byte (1000-based SI)
  data: [
    { id: "bit", label: "Bits",      toBase: (v) => v / 8,           fromBase: (v) => v * 8 },
    { id: "b",   label: "Bytes",     toBase: (v) => v,               fromBase: (v) => v },
    { id: "kb",  label: "Kilobytes", toBase: (v) => v * 1000,        fromBase: (v) => v / 1000 },
    { id: "mb",  label: "Megabytes", toBase: (v) => v * 1e6,         fromBase: (v) => v / 1e6 },
    { id: "gb",  label: "Gigabytes", toBase: (v) => v * 1e9,         fromBase: (v) => v / 1e9 },
    { id: "tb",  label: "Terabytes", toBase: (v) => v * 1e12,        fromBase: (v) => v / 1e12 },
    { id: "pb",  label: "Petabytes", toBase: (v) => v * 1e15,        fromBase: (v) => v / 1e15 },
    { id: "kib", label: "Kibibytes", toBase: (v) => v * 1024,        fromBase: (v) => v / 1024 },
    { id: "mib", label: "Mebibytes", toBase: (v) => v * 1024 ** 2,   fromBase: (v) => v / 1024 ** 2 },
    { id: "gib", label: "Gibibytes", toBase: (v) => v * 1024 ** 3,   fromBase: (v) => v / 1024 ** 3 },
    { id: "tib", label: "Tebibytes", toBase: (v) => v * 1024 ** 4,   fromBase: (v) => v / 1024 ** 4 },
  ],
};

export const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length:      "Length",
  weight:      "Weight",
  temperature: "Temperature",
  area:        "Area",
  volume:      "Volume",
  speed:       "Speed",
  data:        "Data",
};

export function getCategories(): UnitCategory[] {
  return Object.keys(UNITS) as UnitCategory[];
}

export function getUnits(category: UnitCategory): UnitDef[] {
  return UNITS[category];
}

export function convert(
  value: number,
  fromId: string,
  toId: string,
  category: UnitCategory
): number {
  if (!isFinite(value)) return NaN;
  if (fromId === toId) return value;
  const units = UNITS[category];
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from || !to) return NaN;
  const base = from.toBase(value);
  return to.fromBase(base);
}

export function formatResult(n: number): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-9)) {
    return n.toExponential(6).replace(/\.?0+e/, "e");
  }
  // Up to 10 significant digits, trim trailing zeros
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}
