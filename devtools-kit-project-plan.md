# DevTools Kit — Project Plan

## Project Overview

**Repo Name:** `devtools-kit`
**Domain Concept:** `devtools-kit.com` / `devtoolkit.dev` / or use your existing domain at `/tools`
**Tagline:** "The developer's everyday toolkit — fast, free, no-signup tools for DevOps & engineering."

A suite of small, focused, client-side web tools for developers and DevOps engineers. Each tool lives on its own URL (great for SEO), runs entirely in the browser (zero backend cost), and collectively builds a high-traffic, bookmark-worthy destination.

---

## Why This Architecture Works

| Factor | Advantage |
|--------|-----------|
| **AI-resistant** | Tools *do* things — AI can explain cron syntax, but can't give you a live interactive builder you bookmark |
| **SEO multiplier** | Each tool = its own landing page targeting a specific high-intent keyword |
| **Zero backend** | 95% of tools run client-side in JS. No servers, no database, no ongoing cost |
| **Compounding** | Every new tool adds a new SEO entry point and cross-links to existing tools |
| **Low maintenance** | No content treadmill — a cron builder doesn't go stale |
| **Portfolio proof** | Shows real engineering skill, not just words about it |

---

## Hosting Strategy

### Phase 1: Completely Free (Month 1–6+)

**Primary recommendation: Cloudflare Pages**

| Platform | Free Tier | Why / Why Not |
|----------|-----------|---------------|
| **Cloudflare Pages** ✅ | Unlimited bandwidth, 500 builds/month, custom domain, auto SSL | Best free tier. Unlimited bandwidth means you never worry about traffic spikes. Edge-deployed globally |
| Vercel | 100GB bandwidth, 100 builds/day | Excellent DX with Next.js but bandwidth cap could bite if a tool goes viral |
| Netlify | 100GB bandwidth, 300 build minutes | Good but bandwidth cap + slower builds |

**Cost: $0/month.** No asterisk. Cloudflare Pages genuinely free for this use case.

**What you need to pay for:**
- Domain (you already own it): ~$10–15/year
- That's it for Phase 1

### Phase 2: Growth (If/when needed)

If you eventually need server-side features (API-based tools like SSL checker, DNS lookup):

| Service | Purpose | Cost |
|---------|---------|------|
| Cloudflare Workers | Serverless API endpoints | Free for 100K requests/day |
| Cloudflare KV | Simple key-value storage (analytics, counters) | Free for 100K reads/day |
| Upstash Redis | Rate limiting, caching | Free tier: 10K commands/day |

**Estimated Phase 2 cost: Still $0/month** with these free tiers. You'd only start paying at serious scale (millions of requests).

### Phase 3: Revenue Reinvestment

If tools generate ad revenue, consider:
- Cloudflare Pro ($20/month) for analytics and WAF
- A small VPS ($5/month on Hetzner) if you want to run custom APIs

---

## Tech Stack

```
Framework:       Next.js 14+ (App Router, Static Export)
Language:        TypeScript
Styling:         Tailwind CSS
Deployment:      Cloudflare Pages (static export via `next export`)
Package Manager: pnpm
Monorepo:        Turborepo (optional, only if complexity grows)
Analytics:       Plausible (free self-hosted) or Cloudflare Web Analytics (free)
Ads:             Carbon Ads → EthicalAds (developer-focused, non-intrusive)
```

### Why Next.js with Static Export?

- **Static Site Generation (SSG):** Each tool page is pre-rendered at build time → instant load, zero server cost
- **App Router:** Clean `/tools/cron-generator`, `/tools/json-yaml` URL structure
- **SEO built-in:** Meta tags, OpenGraph, structured data per page
- **React ecosystem:** Rich library support for interactive tools
- **`output: 'export'`:** Produces plain HTML/CSS/JS → deploys anywhere (Cloudflare, Vercel, even S3)

---

## Repo Structure

```
devtools-kit/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── og-image.png              # Default social preview
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (nav, footer, ad slots)
│   │   ├── page.tsx              # Homepage — tool directory
│   │   ├── about/
│   │   │   └── page.tsx          # Your experience/portfolio page
│   │   └── tools/
│   │       ├── cron-generator/
│   │       │   └── page.tsx
│   │       ├── json-yaml/
│   │       │   └── page.tsx
│   │       ├── jwt-decoder/
│   │       │   └── page.tsx
│   │       ├── base64/
│   │       │   └── page.tsx
│   │       ├── chmod-calculator/
│   │       │   └── page.tsx
│   │       ├── regex-tester/
│   │       │   └── page.tsx
│   │       ├── hash-generator/
│   │       │   └── page.tsx
│   │       ├── uuid-generator/
│   │       │   └── page.tsx
│   │       ├── subnet-calculator/
│   │       │   └── page.tsx
│   │       ├── http-status/
│   │       │   └── page.tsx
│   │       ├── url-parser/
│   │       │   └── page.tsx
│   │       └── color-converter/
│   │       │   └── page.tsx
│   │       └── timestamp-converter/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ToolLayout.tsx        # Shared wrapper: title, description, ad slot, related tools
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ToolCard.tsx          # Card for homepage grid
│   │   ├── CopyButton.tsx        # Reusable copy-to-clipboard
│   │   ├── AdSlot.tsx            # Encapsulated ad placement
│   │   └── SEOHead.tsx           # Per-page meta/OG tags
│   ├── lib/
│   │   ├── tools-registry.ts     # Central registry of all tools (metadata, categories)
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
```

---

## Tool Prioritization (Launch Order)

Prioritized by: search volume × ease of build × bookmark-worthiness.

### Wave 1 — Launch Set (Week 1–3)
Build these first. Each is a weekend project. Collectively they form a credible "toolkit."

| # | Tool | Target Keyword | Why It's High Priority |
|---|------|---------------|----------------------|
| 1 | **Cron Expression Generator** | "cron expression generator" ~40K/mo | Highest search volume of any DevOps tool query. crontab.guru proves the model works — but its UX is dated. Build a better one with a visual timeline, human-readable descriptions, and preset templates |
| 2 | **JSON ↔ YAML Converter** | "json to yaml" ~33K/mo | Extremely common need. Add validation, syntax highlighting, and error messages. Two-way conversion on one page |
| 3 | **JWT Decoder** | "jwt decoder" ~27K/mo | Paste a token, see header/payload/signature decoded with expiry check and human-readable timestamps. jwt.io exists but is bloated |
| 4 | **Base64 Encode/Decode** | "base64 encode" ~22K/mo | Dead simple tool, huge volume. Support text, file upload, and URL-safe variants |
| 5 | **Regex Tester** | "regex tester" ~49K/mo | High volume. Add real-time match highlighting, capture group display, and a cheat sheet sidebar. Differentiate from regex101 with cleaner UX |

### Wave 2 — Expansion (Week 4–6)

| # | Tool | Target Keyword | Notes |
|---|------|---------------|-------|
| 6 | **Chmod Calculator** | "chmod calculator" ~12K/mo | Visual permission grid (rwx checkboxes) → numeric + symbolic output. Classic DevOps tool |
| 7 | **Hash Generator** | "md5 hash generator" / "sha256" ~18K/mo combined | Input text → MD5, SHA-1, SHA-256, SHA-512 all at once. File hash support too |
| 8 | **UUID Generator** | "uuid generator" ~18K/mo | Generate v4, v7 UUIDs. Bulk generation. One-click copy. Simple but high traffic |
| 9 | **URL Parser / Encoder** | "url encoder" ~14K/mo | Parse URLs into components, encode/decode, build URLs from parts |
| 10 | **Unix Timestamp Converter** | "unix timestamp converter" ~8K/mo | Epoch ↔ human date. Show "time ago", multiple timezone outputs |

### Wave 3 — Differentiation (Week 7–10)

| # | Tool | Target Keyword | Notes |
|---|------|---------------|-------|
| 11 | **HTTP Status Code Reference** | "http status codes" ~22K/mo | Interactive, searchable list with clear explanations and common causes. Not just a table — add context engineers actually need |
| 12 | **Subnet Calculator / CIDR** | "subnet calculator" ~15K/mo | CIDR notation → range, broadcast, usable hosts. Visual subnet map |
| 13 | **Color Converter** | "hex to rgb" ~18K/mo | Hex ↔ RGB ↔ HSL ↔ Tailwind class. Color picker + live preview. Broadens audience beyond pure DevOps |
| 14 | **Docker Compose Validator** | "docker compose validator" ~2K/mo | Lower volume but extremely sticky — no good tool exists online. Paste compose YAML, validate structure, flag common errors |
| 15 | **SSL Certificate Checker** | "ssl checker" ~8K/mo | Enter domain → show cert details, chain, expiry. **Needs a serverless API (Cloudflare Worker)** — first tool requiring backend |

### Wave 4 — Long Tail (Ongoing)

Ideas for continued growth, one per week/fortnight:

- `.gitignore` Generator (template-based)
- Diff / Text Compare Tool
- Markdown Preview + Editor
- IP Address Info Lookup
- DNS Record Lookup
- TOML ↔ JSON ↔ YAML converter
- Password / Secret Generator
- Encoding Converter (UTF-8, ASCII, URL)
- HTML Entity Encoder/Decoder
- JavaScript Object ↔ JSON converter
- CSV ↔ JSON converter
- Environment Variable Parser (.env ↔ export ↔ JSON)
- Container Port Mapper (visual)
- Kubernetes YAML Generator (basic deployment/service templates)

---

## Revenue Strategy

### Ads: Start with Carbon Ads

[Carbon Ads](https://www.carbonads.net/) is purpose-built for developer sites. Key details:

| Aspect | Detail |
|--------|--------|
| **CPM** | $2–5 CPM (higher than generic ads for dev audience) |
| **Format** | Single, small, non-intrusive ad per page |
| **Requirement** | ~10K pageviews/month minimum to apply |
| **Payout** | NET 60, via PayPal |

**Ad placement strategy:** One ad per tool page, placed in the sidebar or below the tool — never interrupting the tool UX. This is critical: tool sites that respect their users get bookmarked.

### Revenue Projections (Conservative)

| Milestone | Monthly Traffic | Ad Revenue (est.) |
|-----------|----------------|-------------------|
| Month 3 (5 tools) | 2K–5K visits | Too early for Carbon; use EthicalAds ($1–2 CPM) → $2–10/mo |
| Month 6 (10 tools) | 10K–20K visits | Apply for Carbon Ads → $20–100/mo |
| Month 12 (15 tools) | 30K–60K visits | $60–300/mo |
| Month 18+ (20 tools) | 80K–150K visits | $160–750/mo |

These are conservative. A single tool going viral (HN, Reddit, Twitter) can 10x a month's traffic. The cron generator alone could drive 5K–10K monthly visits once ranked.

### Additional Revenue Streams (Later)

- **Affiliate links:** Cloud provider referral programs (AWS, DigitalOcean, Hetzner all have them)
- **Sponsored tools:** A vendor pays to sponsor a relevant tool page (e.g., a monitoring company sponsors the SSL checker). Clearly disclosed
- **Premium/Pro features:** Bulk operations, API access, saved configurations — only worth building after significant traffic
- **Newsletter:** Capture emails with a "DevOps tip of the week" — monetize with sponsorships
- **GitHub Sponsors:** If any tool is also an open-source library

---

## SEO Strategy

SEO is the primary traffic driver. Every decision should support it.

### Per-Tool SEO Checklist

```
□ Unique <title>: "Cron Expression Generator — Free Online Cron Builder | DevTools Kit"
□ Meta description: Action-oriented, includes primary keyword, <160 chars
□ H1: Contains primary keyword naturally
□ Canonical URL: https://yourdomain.com/tools/cron-generator
□ OpenGraph + Twitter Card meta tags (with tool-specific preview image)
□ Structured data: SoftwareApplication or WebApplication schema
□ Internal links: "Related tools" section at bottom of every tool
□ Content section: 200-400 words of genuinely useful explanation below the tool
     (e.g., "What is a cron expression?", "Common cron patterns")
     This is NOT filler — it's what Google indexes and what answers user queries
□ URL is clean and keyword-rich: /tools/cron-generator not /tools/tool-1
□ Fast: Target <1s LCP. Static export + Cloudflare CDN handles this
```

### Site-Level SEO

- **XML Sitemap:** Auto-generated, submitted to Google Search Console
- **robots.txt:** Allow all tool pages
- **Internal linking:** Homepage grid links to all tools. Every tool links to 3–4 related tools
- **Blog section (optional, low priority):** Short posts like "5 Cron Patterns Every DevOps Engineer Should Know" that link to the cron tool. Only if you enjoy writing — this is supplementary, not core

---

## Development Workflow with Claude Code

### Initial Setup

```bash
# 1. Create the repo
mkdir devtools-kit && cd devtools-kit
git init

# 2. Scaffold Next.js
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 3. Configure static export in next.config.js
# output: 'export'

# 4. Set up the shared layout, navbar, footer, tool registry
```

### Building Each Tool with Claude Code

For each tool, give Claude Code a prompt like:

```
Build the Cron Expression Generator tool for my devtools-kit project.

Requirements:
- Page at src/app/tools/cron-generator/page.tsx
- Interactive UI: dropdowns/inputs for minute, hour, day, month, weekday
- Real-time cron expression output
- Human-readable description of the schedule
- Visual timeline showing next 5 execution times
- Preset templates (every hour, daily at midnight, weekdays at 9am, etc.)
- Copy button for the expression
- Use the ToolLayout wrapper component
- Add SEO metadata
- Register in tools-registry.ts
- Mobile responsive
```

### Git Workflow

```
main          — production (auto-deploys to Cloudflare Pages)
├── dev       — integration branch
├── feat/cron-generator
├── feat/json-yaml
├── feat/jwt-decoder
└── ...
```

### Deployment Pipeline

```
Push to main → Cloudflare Pages auto-builds → Live in ~30 seconds
```

No CI/CD setup needed — Cloudflare Pages has built-in Git integration. Connect your GitHub repo once and every push to `main` deploys automatically.

---

## 90-Day Execution Plan

### Week 1: Foundation
- [ ] Scaffold Next.js project with static export config
- [ ] Build shared layout: Navbar, Footer, ToolLayout wrapper
- [ ] Create homepage with tool directory grid
- [ ] Set up the "About" page (your experience/portfolio)
- [ ] Deploy to Cloudflare Pages with custom domain
- [ ] Set up Google Search Console + submit sitemap
- [ ] Set up Cloudflare Web Analytics (free)

### Week 2–3: Wave 1 Tools
- [ ] Build and ship: Cron Generator
- [ ] Build and ship: JSON ↔ YAML Converter
- [ ] Build and ship: JWT Decoder
- [ ] Build and ship: Base64 Encode/Decode
- [ ] Build and ship: Regex Tester
- [ ] Cross-link all tools, verify SEO metadata

### Week 4–6: Wave 2 Tools
- [ ] Chmod Calculator
- [ ] Hash Generator
- [ ] UUID Generator
- [ ] URL Parser / Encoder
- [ ] Timestamp Converter
- [ ] Apply for EthicalAds (low-bar alternative to Carbon while traffic grows)

### Week 7–8: Polish + Promote
- [ ] Performance audit (Lighthouse 95+ on all pages)
- [ ] Share individual tools on relevant subreddits, HN, Twitter/X
- [ ] Add "Related Tools" sections to every page
- [ ] Add content sections below each tool for SEO
- [ ] Add PWA support (offline capability — tools work without internet)

### Week 9–10: Wave 3 Tools
- [ ] HTTP Status Code Reference
- [ ] Subnet Calculator
- [ ] Color Converter
- [ ] Docker Compose Validator
- [ ] SSL Checker (first Cloudflare Worker backend)

### Week 11–12: Growth Systems
- [ ] Apply for Carbon Ads (if 10K+ pageviews reached)
- [ ] Set up email capture for optional newsletter
- [ ] Review Search Console data — which tools rank? Double down
- [ ] Plan Wave 4 tools based on actual traffic data

---

## Key Principles

1. **Ship fast, polish later.** A working cron generator with basic UI beats a perfect one that ships in 3 months. Get tools indexed by Google ASAP.

2. **One tool = one page = one keyword.** Never combine tools on a single page. Every tool is its own SEO entry point.

3. **Client-side first.** If it can run in the browser, it should. No backend = no cost = no downtime.

4. **Respect users.** No dark patterns, no email gates, no popups. One small ad per page, placed respectfully. This is how you get bookmarks and organic sharing.

5. **Compound weekly.** One new tool per week is 50 tools in a year. Each one adds traffic. The math works in your favor if you're consistent.

6. **Let data guide you.** After month 2, Search Console will show you which tools get impressions. Build more tools in categories that perform well.

---

## Getting Started (Right Now)

```bash
# Clone your repo and start building
git clone git@github.com:yourusername/devtools-kit.git
cd devtools-kit

# Use Claude Code to scaffold everything
claude "Set up a Next.js 14 project with TypeScript, Tailwind, App Router,
       static export. Create a clean shared layout with a dark-themed navbar,
       tool directory homepage, and a ToolLayout wrapper component that
       handles SEO meta tags, a consistent tool UI frame, and a related
       tools section. Use a tools-registry.ts file as the central source
       of truth for all tool metadata."

# Then build your first tool
claude "Build the Cron Expression Generator tool at /tools/cron-generator.
       Make it interactive, include preset templates, show next 5 run times,
       and add a human-readable description. Register it in tools-registry."

# Deploy
# Connect GitHub repo to Cloudflare Pages → automatic deploys on push
```

You can realistically have 5 tools live within 2 weeks, spending evenings and weekends. The domain starts earning its keep from day one.
