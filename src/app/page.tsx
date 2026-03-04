import type { Metadata } from "next";
import HomeToolsGrid from "@/components/HomeToolsGrid";
import { tools, categoryLabels, ToolCategory } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "DevTools Kit — Free Online Developer Tools",
  description:
    "The developer's everyday toolkit. Fast, free, client-side tools for DevOps & engineering. Cron generator, JWT decoder, JSON↔YAML, Base64, Regex tester, and more.",
};

// All categories in display order (registry order)
const allCategories = Object.keys(categoryLabels) as ToolCategory[];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* ── Hero ── */}
      <section className="mb-12 text-center">
        <div className="mb-5 inline-flex items-center rounded-full border border-[#30363d] bg-[#1c2128] px-3 py-1 text-xs text-[#8b949e]">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
          All tools run 100% in your browser
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">
          The Developer&apos;s Everyday Toolkit
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#8b949e] sm:text-lg">
          Fast, free tools for DevOps &amp; engineering. No signup, no
          tracking, no backend — everything runs locally in your browser.
        </p>

        {/* Stats row */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#8b949e]">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e6edf3]">
              {tools.length}
            </div>
            <div className="text-xs">Tools</div>
          </div>
          <div className="h-8 w-px bg-[#30363d]" />
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e6edf3]">0</div>
            <div className="text-xs">Data sent to server</div>
          </div>
          <div className="h-8 w-px bg-[#30363d]" />
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e6edf3]">Free</div>
            <div className="text-xs">Forever</div>
          </div>
        </div>
      </section>

      {/* ── Tool Grid (search + filter + sort + wave sections) ── */}
      <section className="mb-16">
        <HomeToolsGrid tools={tools} />
      </section>

      {/* ── Browse by Category (SEO + quick reference) ── */}
      <section className="border-t border-[#30363d] pt-12 mt-4">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#484f58]">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {allCategories.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            return (
              <div
                key={cat}
                className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center"
              >
                <div className="text-lg font-bold text-[#e6edf3]">{count}</div>
                <div className="mt-0.5 text-xs text-[#8b949e]">
                  {categoryLabels[cat]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mt-16 rounded-xl border border-[#30363d] bg-[#161b22] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[#e6edf3]">
          Built for developers, by a developer
        </h2>
        <p className="mx-auto max-w-md text-sm text-[#8b949e]">
          Every tool runs entirely in your browser. Your data never leaves your
          machine. No tracking, no analytics on tool usage, no cookies.
        </p>
      </section>
    </main>
  );
}
