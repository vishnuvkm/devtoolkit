export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "slug";

export interface CaseOption {
  type: CaseType;
  label: string;
  example: string;
}

export const CASE_OPTIONS: CaseOption[] = [
  { type: "upper",    label: "UPPER CASE",    example: "HELLO WORLD" },
  { type: "lower",    label: "lower case",    example: "hello world" },
  { type: "title",    label: "Title Case",    example: "Hello World" },
  { type: "sentence", label: "Sentence case", example: "Hello world" },
  { type: "camel",    label: "camelCase",     example: "helloWorld" },
  { type: "pascal",   label: "PascalCase",    example: "HelloWorld" },
  { type: "snake",    label: "snake_case",    example: "hello_world" },
  { type: "kebab",    label: "kebab-case",    example: "hello-world" },
  { type: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { type: "slug",     label: "slug",          example: "hello-world" },
];

/** Split text into individual words, stripping punctuation & separators */
function toWords(text: string): string[] {
  // Split on whitespace, underscores, hyphens, and camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // ABBRCase → ABBR Case
    .split(/[\s\-_/\\.,;:!?@#$%^&*()\[\]{}<>|`~"'+=]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

export function convertCase(text: string, caseType: CaseType): string {
  if (!text) return "";
  const words = toWords(text);
  if (words.length === 0) return "";

  switch (caseType) {
    case "upper":
      return text.toUpperCase();

    case "lower":
      return text.toLowerCase();

    case "title":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

    case "sentence": {
      const lower = text.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    case "camel":
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");

    case "pascal":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");

    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");

    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");

    case "constant":
      return words.map((w) => w.toUpperCase()).join("_");

    case "slug":
      return words
        .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
        .filter((w) => w.length > 0)
        .join("-");

    default:
      return text;
  }
}

export function convertAll(text: string): Record<CaseType, string> {
  const result = {} as Record<CaseType, string>;
  for (const opt of CASE_OPTIONS) {
    result[opt.type] = convertCase(text, opt.type);
  }
  return result;
}
