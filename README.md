# DevTools Kit

A fast, free, open-source collection of developer and everyday tools. Built with Next.js, TypeScript, and Tailwind CSS. Runs entirely in the browser — no server, no signup, no data collection.

**Live:** https://devtoolkit.dev  
**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Vitest · pnpm  
**Deployment:** Cloudflare Pages (static export)

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Run all tests
pnpm test:run

# Build static export (outputs to out/)
pnpm run build
```

---

## Project Structure

```
devtoolkit/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — Cloudflare Analytics, PWA, fonts
│   │   ├── page.tsx                # Homepage — wave sections + search/filter (HomeToolsGrid)
│   │   ├── about/page.tsx          # About page
│   │   ├── sitemap.ts              # Dynamic sitemap (needs force-static export)
│   │   └── tools/
│   │       └── [slug]/
│   │           ├── page.tsx        # Server Component — metadata + ToolLayout
│   │           └── ToolNameTool.tsx # Client Component — interactive UI
│   ├── components/
│   │   ├── HomeToolsGrid.tsx       # Homepage search/filter/sort (client)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ToolLayout.tsx          # Shared wrapper: back link + title + explainer + related tools
│   │   ├── ToolCard.tsx            # Tool card used on homepage and in related tools
│   │   ├── CopyButton.tsx          # Reusable copy-to-clipboard button
│   │   └── PWARegister.tsx         # Registers service worker
│   └── lib/
│       ├── tools-registry.ts       # CENTRAL: all tool metadata
│       ├── [tool]-utils.ts         # Pure utility functions (one per tool)
│       └── ...
├── src/__tests__/
│   └── [tool]-utils.test.ts        # Vitest unit tests (one per lib file)
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker (stale-while-revalidate)
│   └── icon.svg                    # App icon
├── next.config.ts                  # output: 'export', trailingSlash: true
└── vitest.config.ts
```

---

## How to Add a New Tool

Adding a tool requires exactly **4 files** and **1 registry entry**. Follow these steps in order:

### Step 1 — Register the tool

Edit `src/lib/tools-registry.ts` and add an entry to the `tools` array:

```typescript
{
  slug: "my-tool",                          // URL: /tools/my-tool
  name: "My Tool",                          // Display name
  description: "Short one-liner (< 120 chars) — shown on cards and in search.",
  longDescription: "Longer description for the tool page explainer section.",
  category: "text",                         // See ToolCategory type below
  wave: 4,                                  // Current wave (use 4 for new tools)
  icon: "Wrench",                           // Lucide icon name — must also add to ToolCard.tsx
  targetKeyword: "my tool online",          // Primary SEO keyword
  relatedTools: ["word-counter", "regex-tester", "json-yaml"], // 3 slugs
},
```

**Available categories:** `encoding` | `devops` | `networking` | `text` | `conversion` | `generators` | `math`

### Step 2 — Add the icon to ToolCard

Edit `src/components/ToolCard.tsx`:

```typescript
// 1. Add to the lucide-react import:
import { ..., Wrench } from "lucide-react";

// 2. Add to iconMap:
const iconMap: Record<string, LucideIcon> = {
  ...,
  Wrench,
};
```

### Step 3 — Create the lib utility file

Create `src/lib/my-tool-utils.ts`:

```typescript
// Pure functions only — no React, no side effects, no async (unless truly needed)
// This file must be importable in Node.js (Vitest runs here)

export interface MyToolResult {
  // ...
}

export function myMainFunction(input: string): MyToolResult {
  // Logic here
}
```

**Rules:**
- No `"use client"` — this is a plain TypeScript module
- No browser APIs (`window`, `document`, `localStorage`) — use only Web APIs available in Node 18+
- Exception: `crypto.getRandomValues()` is available in Node 18+ for cryptographic randomness
- Exception: `SubtleCrypto` (`crypto.subtle`) is available for hashing (see `src/lib/hash.ts`)
- Exception: `qrcode` npm package is imported in `src/lib/qr-utils.ts` (async, Promise-based)
- Prefer `useMemo` in the client component for derived values; keep pure math in lib

### Step 4 — Create the test file

Create `src/__tests__/my-tool-utils.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { myMainFunction } from "../lib/my-tool-utils";

describe("myMainFunction", () => {
  it("handles normal input", () => {
    const result = myMainFunction("hello");
    expect(result).toBeDefined();
  });

  it("handles empty string", () => {
    const result = myMainFunction("");
    // ...
  });
});
```

Run tests: `pnpm test:run -- my-tool-utils`

### Step 5 — Create the page (Server Component)

Create `src/app/tools/my-tool/page.tsx`:

```tsx
import type { Metadata } from "next";
import { tools } from "@/lib/tools-registry";
import ToolLayout from "@/components/ToolLayout";
import MyTool from "./MyTool";

export const metadata: Metadata = {
  title: "My Tool — Free Online Tool | DevTools Kit",
  description: "One-sentence description for search engines (150–160 chars ideal).",
};

export default function MyToolPage() {
  const tool = tools.find((t) => t.slug === "my-tool")!;
  return (
    <ToolLayout tool={tool}>
      <MyTool />
    </ToolLayout>
  );
}
```

**Notes:**
- This is a **Server Component** — no `"use client"`, no hooks
- `tools.find(...)` is fine in a Server Component — it's just array lookup
- `ToolLayout` automatically adds: back link, title, description, related tools grid

### Step 6 — Create the interactive component (Client Component)

Create `src/app/tools/my-tool/MyTool.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { myMainFunction } from "@/lib/my-tool-utils";
import CopyButton from "@/components/CopyButton";

export default function MyTool() {
  const [input, setInput] = useState("");

  // ALWAYS use useMemo for derived values — never compute in render body
  const result = useMemo(() => myMainFunction(input), [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:outline-none focus:border-[#3b82f6] font-mono"
          placeholder="Enter input here..."
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[#e6edf3]">Output</span>
          <CopyButton text={String(result)} />
        </div>
        <pre className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] font-mono overflow-auto">
          {String(result)}
        </pre>
      </div>
    </div>
  );
}
```

### Step 7 — Verify

```bash
pnpm test:run            # All tests should pass
pnpm run build           # Build should succeed with new page in out/
```

---

## Tool Registry Schema

```typescript
interface Tool {
  slug: string;          // Lowercase, hyphen-separated. Becomes the URL path.
  name: string;          // Title-case display name.
  description: string;   // One-liner shown on cards, search results, and meta tags.
  longDescription: string; // 2–3 sentences for the tool page / SEO explainer.
  category: ToolCategory;  // Controls badge color on cards.
  wave: ToolWave;          // 1–4. Used for homepage section grouping.
  icon: string;            // Lucide icon name (PascalCase). Must be in ToolCard iconMap.
  targetKeyword: string;   // Primary search keyword for SEO.
  relatedTools: string[];  // 3 slugs shown in the "Related Tools" section.
}
```

**Categories and colors:**
| Category | Label | Badge Color |
|---|---|---|
| `encoding` | Encoding & Crypto | Orange |
| `devops` | DevOps | Blue |
| `networking` | Networking | Light cyan |
| `text` | Text & Regex | Purple |
| `conversion` | Converters | Green |
| `generators` | Generators | Gold |
| `math` | Math & Calculators | Pink |

---

## Component Library

### `ToolLayout`

Wraps every tool page. Provides back navigation, title, description, related tools.

```tsx
import ToolLayout from "@/components/ToolLayout";

<ToolLayout
  tool={tool}                    // Required: Tool object from registry
  explainer={<div>...</div>}     // Optional: SEO copy rendered below the tool
>
  <YourToolComponent />
</ToolLayout>
```

### `CopyButton`

```tsx
import CopyButton from "@/components/CopyButton";

<CopyButton text="text to copy" />
// Shows "Copy" → "Copied!" → resets after 2 seconds
```

### `ToolCard`

Used automatically by `ToolLayout` for related tools and by `HomeToolsGrid` for the homepage grid. You shouldn't need to use it directly.

---

## Design System

All colors use Tailwind v4 CSS variable syntax in `src/app/globals.css`. Key values:

| Token | Value | Usage |
|---|---|---|
| Background | `#0d1117` | Page background |
| Surface | `#161b22` | Cards, panels |
| Surface hover | `#1c2128` | Card hover state |
| Border | `#30363d` | Card borders, inputs |
| Border hover | `#484f58` | Input focus, hover |
| Text primary | `#e6edf3` | Headings, values |
| Text secondary | `#8b949e` | Labels, descriptions |
| Text muted | `#484f58` | Placeholder, helper |
| Accent | `#3b82f6` | Blue — interactive elements, focus rings |
| Error | `#f85149` | Error states |
| Warning | `#d29922` | Warning states |
| Success | `#3fb950` | Success states |

**Common patterns:**

```tsx
// Input
className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:outline-none focus:border-[#3b82f6]"

// Active toggle button
className="border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"

// Inactive toggle button
className="border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"

// Card
className="rounded-lg border border-[#30363d] bg-[#161b22] p-4"

// Error banner
className="rounded-md border border-[#f85149]/50 bg-[#2d0f0f] px-4 py-3 text-sm text-[#f85149]"

// Success/highlight
className="rounded-md border border-[#3b82f6]/50 bg-[#1e3a5f]/30 px-4 py-3 text-sm text-[#3b82f6]"
```

---

## Testing Guide

All pure utility functions in `src/lib/` have a corresponding test file in `src/__tests__/`. Client components are **not** tested directly — only the pure logic they call.

```bash
pnpm test:run                       # Run all tests once
pnpm test                           # Watch mode
pnpm test:run -- my-tool-utils      # Run one specific test file
```

**What to test:**
- Happy path with expected output
- Edge cases: empty string, zero, negative numbers, invalid input
- Round-trip conversions: `decode(encode(x)) === x`
- Boundary values: min, max, off-by-one

**Test naming convention:**
- File: `src/__tests__/[tool-name]-utils.test.ts` (matches lib file name)
- Suite: `describe("functionName", ...)`
- Case: `it("does X when Y", ...)`

---

## Architecture Gotchas

Things that have caused bugs and must be followed:

### 1. Never call `setState` during render
```tsx
// WRONG — causes React infinite loop
const result = someComputation(input);
setResult(result); // called during render

// CORRECT — derived value with useMemo
const result = useMemo(() => someComputation(input), [input]);
```

### 2. Tailwind v4 syntax is different from v3
```css
/* v3 syntax — doesn't work in this project */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 syntax */
@import "tailwindcss";
@theme inline { ... }
```

### 3. `sitemap.ts` needs force-static
```typescript
// Required for Next.js static export:
export const dynamic = "force-static";
```

### 4. JSDoc comments with `*/` inside break Turbopack
```typescript
// WRONG — the */ in cron pattern closes the JSDoc early
/**
 * Example: */5 * * * * (every 5 min)
 */

// CORRECT — use line comments for examples with */
// Example: */5 * * * * (every 5 min)
```

### 5. Viewport export is separate from Metadata in Next.js 14+
```typescript
// In layout.tsx — these MUST be separate named exports:
export const metadata: Metadata = { ... };
export const viewport: Viewport = { themeColor: "..." };
```

### 6. Async lib functions need `useEffect`, not `useMemo`
```tsx
// For async functions (e.g., SubtleCrypto, qrcode package):
const [result, setResult] = useState("");
useEffect(() => {
  asyncFunction(input).then(setResult);
}, [input]);

// useMemo only works for synchronous functions
```

### 7. `crypto.getRandomValues()` is available in Node 18+
The Password Generator uses `crypto.getRandomValues()` which works in both browser and Node 18+ test environment. No polyfill needed.

---

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - **Build command:** `pnpm run build`
   - **Build output directory:** `out`
   - **Node.js version:** `18.x` or later
3. Set environment variables:
   - `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` — your Cloudflare Analytics token
4. Deploy!

### After going live

Update these two places with your actual domain:
- `public/robots.txt` — update `sitemap:` URL
- `src/app/sitemap.ts` — update `BASE_URL` constant

### Local build check

```bash
pnpm run build          # Creates out/ directory
npx serve out           # Preview the static export locally
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Optional | Cloudflare Web Analytics token. Analytics only loads in production when this is set. |

---

## Adding a New Category

If you need a category that doesn't exist:

1. **`src/lib/tools-registry.ts`** — add to `ToolCategory` union type and `categoryLabels` record
2. **`src/components/ToolCard.tsx`** — add to `categoryColors` record (pick a distinct color)
3. **`src/components/HomeToolsGrid.tsx`** — the `CATEGORY_PILL_ACTIVE` map for search pill colors

Use a color not already taken (orange, blue, cyan, purple, green, gold, pink are used).
