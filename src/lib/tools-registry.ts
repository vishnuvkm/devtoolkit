export type ToolCategory =
  | "encoding"
  | "devops"
  | "networking"
  | "text"
  | "conversion"
  | "generators"
  | "math";

export type ToolWave = 1 | 2 | 3 | 4;

export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  wave: ToolWave;
  icon: string;
  targetKeyword: string;
  relatedTools: string[]; // slugs
}

export const tools: Tool[] = [
  // Wave 1
  {
    slug: "cron-generator",
    name: "Cron Expression Generator",
    description:
      "Build and validate cron expressions with a visual editor. See next run times instantly.",
    longDescription:
      "Generate cron expressions with an interactive UI. Choose minute, hour, day, month, and weekday values, get a human-readable description, and preview the next 5 execution times.",
    category: "devops",
    wave: 1,
    icon: "Clock",
    targetKeyword: "cron expression generator",
    relatedTools: ["timestamp-converter", "uuid-generator", "hash-generator"],
  },
  {
    slug: "json-yaml",
    name: "JSON ↔ YAML Converter",
    description:
      "Convert between JSON and YAML instantly with validation and syntax highlighting.",
    longDescription:
      "Paste JSON or YAML and convert in both directions. Includes real-time validation, error messages, and syntax highlighting for readable output.",
    category: "conversion",
    wave: 1,
    icon: "ArrowLeftRight",
    targetKeyword: "json to yaml converter",
    relatedTools: ["jwt-decoder", "base64", "url-parser"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description:
      "Decode JWT tokens — inspect header, payload, and signature. Check expiry instantly.",
    longDescription:
      "Paste any JSON Web Token to decode and inspect its header, payload, and signature. Shows human-readable timestamps and checks if the token is expired.",
    category: "encoding",
    wave: 1,
    icon: "KeyRound",
    targetKeyword: "jwt decoder",
    relatedTools: ["base64", "json-yaml", "hash-generator"],
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    description:
      "Encode or decode Base64 strings. Supports text, URL-safe variant, and file input.",
    longDescription:
      "Encode text or files to Base64, or decode Base64 back to its original form. Supports standard Base64 and URL-safe variants. File upload supported.",
    category: "encoding",
    wave: 1,
    icon: "FileCode",
    targetKeyword: "base64 encode decode",
    relatedTools: ["jwt-decoder", "url-parser", "hash-generator"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description:
      "Test regular expressions in real time. See matches, capture groups, and a quick-reference cheat sheet.",
    longDescription:
      "Enter a regex pattern and test string to see all matches highlighted in real time. View capture groups, flags reference, and a handy regex cheat sheet sidebar.",
    category: "text",
    wave: 1,
    icon: "SearchCode",
    targetKeyword: "regex tester",
    relatedTools: ["json-yaml", "url-parser", "base64"],
  },
  // Wave 2
  {
    slug: "chmod-calculator",
    name: "Chmod Calculator",
    description:
      "Calculate Unix file permissions with a visual grid. Get numeric and symbolic output.",
    longDescription:
      "Click checkboxes for owner/group/other read/write/execute permissions and instantly get the numeric (e.g. 755) and symbolic (e.g. rwxr-xr-x) chmod values.",
    category: "devops",
    wave: 2,
    icon: "ShieldCheck",
    targetKeyword: "chmod calculator",
    relatedTools: ["cron-generator", "hash-generator", "uuid-generator"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files instantly.",
    longDescription:
      "Enter text or upload a file to generate MD5, SHA-1, SHA-256, and SHA-512 hashes all at once. One-click copy for each hash output.",
    category: "encoding",
    wave: 2,
    icon: "Hash",
    targetKeyword: "sha256 hash generator",
    relatedTools: ["base64", "jwt-decoder", "uuid-generator"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate v4 UUIDs in bulk. One-click copy, zero friction.",
    longDescription:
      "Generate one or many UUID v4 values with a single click. Bulk generation up to 100 UUIDs. Copy individually or all at once.",
    category: "generators",
    wave: 2,
    icon: "Fingerprint",
    targetKeyword: "uuid generator",
    relatedTools: ["hash-generator", "base64", "cron-generator"],
  },
  {
    slug: "url-parser",
    name: "URL Parser & Encoder",
    description:
      "Parse any URL into its components. Encode/decode query strings and path segments.",
    longDescription:
      "Break down any URL into protocol, host, path, query parameters, and fragment. URL-encode or decode any string. Build URLs from individual parts.",
    category: "networking",
    wave: 2,
    icon: "Link",
    targetKeyword: "url encoder decoder",
    relatedTools: ["json-yaml", "base64", "regex-tester"],
  },
  {
    slug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Shows multiple timezones.",
    longDescription:
      "Convert Unix epoch timestamps to readable dates, or any date back to a timestamp. Shows relative time (e.g. '3 hours ago') and multiple timezone outputs.",
    category: "conversion",
    wave: 2,
    icon: "Calendar",
    targetKeyword: "unix timestamp converter",
    relatedTools: ["cron-generator", "jwt-decoder", "uuid-generator"],
  },
  // Wave 3
  {
    slug: "http-status",
    name: "HTTP Status Code Reference",
    description:
      "Interactive, searchable HTTP status code reference with explanations and common causes.",
    longDescription:
      "Look up any HTTP status code with clear explanations, common causes, and practical advice. Searchable and organized by category (1xx–5xx).",
    category: "networking",
    wave: 3,
    icon: "Globe",
    targetKeyword: "http status codes",
    relatedTools: ["url-parser", "json-yaml", "regex-tester"],
  },
  {
    slug: "subnet-calculator",
    name: "Subnet Calculator / CIDR",
    description:
      "Calculate subnet ranges, broadcast address, and usable hosts from CIDR notation.",
    longDescription:
      "Enter a CIDR block (e.g. 192.168.1.0/24) to get network address, broadcast address, usable host range, and total hosts. Visual subnet map included.",
    category: "networking",
    wave: 3,
    icon: "Network",
    targetKeyword: "subnet calculator",
    relatedTools: ["http-status", "url-parser", "chmod-calculator"],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description:
      "Convert between HEX, RGB, HSL, and Tailwind CSS color classes with a live preview.",
    longDescription:
      "Enter a color in any format — HEX, RGB, HSL — and instantly see all equivalent representations plus the nearest Tailwind CSS color class. Live color preview.",
    category: "conversion",
    wave: 3,
    icon: "Palette",
    targetKeyword: "hex to rgb converter",
    relatedTools: ["json-yaml", "url-parser", "base64"],
  },
  {
    slug: "docker-compose-validator",
    name: "Docker Compose Validator",
    description:
      "Validate Docker Compose YAML files. Check structure, required fields, and flag common errors.",
    longDescription:
      "Paste a Docker Compose file to validate its structure — service definitions, port formats, volume mounts, depends_on references, and more. Instant feedback with line-level error details.",
    category: "devops",
    wave: 3,
    icon: "Container",
    targetKeyword: "docker compose validator",
    relatedTools: ["json-yaml", "chmod-calculator", "cron-generator"],
  },
  // Wave 4
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description:
      "Calculate percentages instantly — find X% of Y, percentage change, and add or subtract a percentage from any value.",
    longDescription:
      "Four calculators in one: find what X% of a number is, determine what percentage one number is of another, calculate percentage increase or decrease between two values, and add or subtract a percentage from any base value.",
    category: "math",
    wave: 4,
    icon: "Percent",
    targetKeyword: "percentage calculator",
    relatedTools: ["timestamp-converter", "color-converter", "uuid-generator"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, secure, random passwords. Customize length, character types, and exclude ambiguous characters.",
    longDescription:
      "Generate cryptographically secure passwords entirely in your browser using crypto.getRandomValues(). Choose length (8–128), toggle uppercase, lowercase, numbers, and symbols, exclude ambiguous characters, and bulk-generate up to 20 passwords at once.",
    category: "generators",
    wave: 4,
    icon: "KeyRound",
    targetKeyword: "password generator",
    relatedTools: ["hash-generator", "uuid-generator", "jwt-decoder"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Get reading time and top keyword frequency.",
    longDescription:
      "Paste or type any text to get a full breakdown: word count, character count (with and without spaces), sentence count, paragraph count, estimated reading time, unique word count, and the top 5 most frequent meaningful words.",
    category: "text",
    wave: 4,
    icon: "AlignLeft",
    targetKeyword: "word counter",
    relatedTools: ["regex-tester", "json-yaml", "base64"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description:
      "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or word count. Output as plain text, HTML, or Markdown.",
    longDescription:
      "Generate Lorem Ipsum placeholder text in seconds. Choose how many paragraphs, sentences, or words you need, pick plain text, HTML, or Markdown output, and toggle the classic opening line. Fully deterministic and browser-based.",
    category: "text",
    wave: 4,
    icon: "Type",
    targetKeyword: "lorem ipsum generator",
    relatedTools: ["word-counter", "regex-tester", "json-yaml"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description:
      "Convert text between UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case, and 6 more formats instantly.",
    longDescription:
      "Paste any text and convert it to 10 different casing formats at once: UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and slug. One-click copy for each.",
    category: "text",
    wave: 4,
    icon: "CaseSensitive",
    targetKeyword: "case converter online",
    relatedTools: ["word-counter", "lorem-ipsum", "regex-tester"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, or any content. Download as PNG or SVG. Free, no signup.",
    longDescription:
      "Generate QR codes entirely in your browser. Enter a URL or any text, choose size (128–512px) and error correction level, then download as PNG or SVG. No server, no data collected.",
    category: "generators",
    wave: 4,
    icon: "QrCode",
    targetKeyword: "qr code generator",
    relatedTools: ["uuid-generator", "password-generator", "base64"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert between units of length, weight, temperature, area, volume, speed, and data. Instant results.",
    longDescription:
      "Convert between 60+ units across 7 categories: length (mm to miles), weight (mg to tonnes), temperature (Celsius/Fahrenheit/Kelvin), area, volume, speed, and digital data (bytes to TB). All conversions happen instantly in your browser.",
    category: "conversion",
    wave: 4,
    icon: "Ruler",
    targetKeyword: "unit converter",
    relatedTools: ["percentage-calculator", "timestamp-converter", "color-converter"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description:
      "Calculate exact age from a birthdate. Shows years, months, days, and days until next birthday.",
    longDescription:
      "Enter a birthdate and get the exact age in years, months, and days — plus total days lived, total weeks, and a countdown to the next birthday. Useful for forms, health records, and general curiosity.",
    category: "math",
    wave: 4,
    icon: "Cake",
    targetKeyword: "age calculator",
    relatedTools: ["days-between-dates", "timestamp-converter", "percentage-calculator"],
  },
  {
    slug: "days-between-dates",
    name: "Days Between Dates",
    description:
      "Calculate the number of days between two dates. Shows working days, weeks, and a human-readable summary.",
    longDescription:
      "Pick a start and end date to see: total calendar days, working days (Monday–Friday), total weeks, and a friendly breakdown (e.g. '2 years, 3 months, 12 days'). Useful for project planning, contracts, and countdowns.",
    category: "math",
    wave: 4,
    icon: "CalendarRange",
    targetKeyword: "days between dates",
    relatedTools: ["age-calculator", "timestamp-converter", "percentage-calculator"],
  },
];

export const toolsBySlug: Record<string, Tool> = Object.fromEntries(
  tools.map((t) => [t.slug, t])
);

export const toolsByWave = (wave: ToolWave) =>
  tools.filter((t) => t.wave === wave);

export const toolsByCategory = (category: ToolCategory) =>
  tools.filter((t) => t.category === category);

export const getRelatedTools = (slug: string): Tool[] => {
  const tool = toolsBySlug[slug];
  if (!tool) return [];
  return tool.relatedTools
    .map((s) => toolsBySlug[s])
    .filter(Boolean) as Tool[];
};

export const categoryLabels: Record<ToolCategory, string> = {
  encoding: "Encoding & Crypto",
  devops: "DevOps",
  networking: "Networking",
  text: "Text & Regex",
  conversion: "Converters",
  generators: "Generators",
  math: "Math & Calculators",
};
