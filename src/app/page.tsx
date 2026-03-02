import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { tools, categoryLabels, ToolCategory } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "DevTools Kit — Free Online Developer Tools",
  description:
    "The developer's everyday toolkit. Fast, free, client-side tools for DevOps & engineering. Cron generator, JWT decoder, JSON↔YAML, Base64, Regex tester, and more.",
};

const wave1Tools = tools.filter((t) => t.wave === 1);
const wave2Tools = tools.filter((t) => t.wave === 2);
const wave3Tools = tools.filter((t) => t.wave === 3);

const categoryOrder: ToolCategory[] = [
  "devops",
  "encoding",
  "conversion",
  "text",
  "networking",
  "generators",
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center rounded-full border border-[#30363d] bg-[#1c2128] px-3 py-1 text-xs text-[#8b949e] mb-5">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#3fb950] inline-block" />
          All tools run 100% in your browser
        </div>
        <h1 className="text-3xl font-bold text-[#e6edf3] sm:text-5xl mb-4 tracking-tight">
          The Developer&apos;s Everyday Toolkit
        </h1>
        <p className="text-[#8b949e] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Fast, free tools for DevOps &amp; engineering. No signup, no tracking,
          no backend — everything runs locally in your browser.
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

      {/* Wave 1 — Featured */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58]">
            Popular Tools
          </h2>
          <span className="text-xs text-[#484f58] bg-[#1c2128] border border-[#30363d] rounded-full px-2 py-0.5">
            Most searched
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wave1Tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Wave 2 */}
      {wave2Tools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-5">
            More Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wave2Tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Wave 3 */}
      {wave3Tools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-5">
            Networking &amp; More
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wave3Tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="mt-16 border-t border-[#30363d] pt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categoryOrder.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            return (
              <div
                key={cat}
                className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center"
              >
                <div className="text-lg font-bold text-[#e6edf3]">{count}</div>
                <div className="text-xs text-[#8b949e] mt-0.5">
                  {categoryLabels[cat]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 rounded-xl border border-[#30363d] bg-[#161b22] p-8 text-center">
        <h2 className="text-xl font-semibold text-[#e6edf3] mb-2">
          Built for developers, by a developer
        </h2>
        <p className="text-sm text-[#8b949e] max-w-md mx-auto">
          Every tool runs entirely in your browser. Your data never leaves your
          machine. No tracking, no analytics on tool usage, no cookies.
        </p>
      </section>
    </main>
  );
}
