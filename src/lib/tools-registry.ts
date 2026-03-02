export type ToolCategory =
  | "encoding"
  | "devops"
  | "networking"
  | "text"
  | "conversion"
  | "generators";

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
};
