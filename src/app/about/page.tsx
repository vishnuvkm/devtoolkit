import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Globe, Github, Code2, Zap, Shield } from "lucide-react";
import { tools } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "About",
  description:
    "About DevTools Kit — a collection of fast, free, client-side developer tools built for engineers who value speed and privacy.",
};

const principles = [
  {
    icon: Zap,
    title: "Fast & Offline-capable",
    description:
      "Every tool runs in your browser. No round-trips to a server means instant results even on a slow connection.",
  },
  {
    icon: Shield,
    title: "Privacy first",
    description:
      "Your data never leaves your machine. We don't log inputs, outputs, or any tool usage. There are no cookies beyond what the browser requires.",
  },
  {
    icon: Code2,
    title: "Built for engineers",
    description:
      "Each tool is purpose-built for real developer workflows — not dumbed down for a general audience.",
  },
  {
    icon: Globe,
    title: "Free, forever",
    description:
      "All core tools are and will remain free. The site is sustained by a single, non-intrusive developer ad per page.",
  },
];

export default function AboutPage() {
  const wave1Count = tools.filter((t) => t.wave === 1).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-6 w-6 text-[#3b82f6]" />
          <h1 className="text-3xl font-bold text-[#e6edf3]">DevTools Kit</h1>
        </div>
        <p className="text-[#8b949e] text-lg leading-relaxed">
          A suite of small, focused, client-side tools for developers and DevOps
          engineers. Each tool does one thing and does it well.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: String(tools.length), label: "Tools" },
          { value: "0ms", label: "Server latency" },
          { value: "100%", label: "Client-side" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="rounded-lg border border-[#30363d] bg-[#161b22] p-4 text-center"
          >
            <div className="text-2xl font-bold text-[#e6edf3]">{value}</div>
            <div className="text-xs text-[#8b949e] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Principles */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-6">
          Design Principles
        </h2>
        <div className="space-y-4">
          {principles.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-lg border border-[#30363d] bg-[#161b22] p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1c2128] border border-[#30363d]">
                <Icon className="h-4 w-4 text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-1">
                  {title}
                </h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-4">
          Tech Stack
        </h2>
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
          <ul className="space-y-2 text-sm">
            {[
              ["Framework", "Next.js (App Router, Static Export)"],
              ["Language", "TypeScript"],
              ["Styling", "Tailwind CSS v4"],
              ["Hosting", "Cloudflare Pages (edge CDN, free tier)"],
              ["Package Manager", "pnpm"],
              ["Backend", "None — everything runs in the browser"],
            ].map(([key, val]) => (
              <li key={key} className="flex gap-3">
                <span className="w-36 shrink-0 text-[#484f58]">{key}</span>
                <span className="text-[#8b949e] font-mono text-xs">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-4">
          Roadmap
        </h2>
        <div className="space-y-2">
          {[
            { wave: "Wave 1", count: wave1Count, label: "Core tools (live)", done: true },
            { wave: "Wave 2", count: 5, label: "DevOps utilities", done: false },
            { wave: "Wave 3", count: 5, label: "Networking & more", done: false },
            { wave: "Wave 4", count: "∞", label: "Long-tail tools (ongoing)", done: false },
          ].map(({ wave, count, label, done }) => (
            <div
              key={wave}
              className="flex items-center gap-3 rounded border border-[#30363d] bg-[#161b22] px-4 py-3"
            >
              <div
                className={`h-2 w-2 rounded-full shrink-0 ${
                  done ? "bg-[#3fb950]" : "bg-[#30363d]"
                }`}
              />
              <span className="text-xs font-medium text-[#484f58] w-16">{wave}</span>
              <span className="text-xs text-[#e6edf3]">{label}</span>
              <span className="ml-auto text-xs text-[#484f58]">{count} tools</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] transition-colors"
        >
          <Wrench className="h-4 w-4" />
          Browse all tools
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm font-medium text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </main>
  );
}
