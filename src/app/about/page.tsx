import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Globe, Github, Code2, Zap, Shield, Linkedin, Bug, Lightbulb } from "lucide-react";
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
      "All core tools are and will remain free. Built and maintained by a single developer as a passion project.",
  },
];

export default function AboutPage() {
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

      {/* Built By */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-4">
          Built By
        </h2>
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#e6edf3]">Vishnu Prasad</h3>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Platform Engineer · Cloud &amp; DevOps · Melbourne, Australia
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/vishnuvkm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#1c2128] px-3 py-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          </div>

          <p className="text-sm text-[#8b949e] leading-relaxed mb-4">
            Software engineer with 12+ years of experience across web development, cloud
            infrastructure, CI/CD, and DevOps. Built DevTools Kit as a side project to scratch
            my own itch — fast, no-nonsense tools that just work.
          </p>

          {/* Skills */}
          <div className="mb-4">
            <p className="text-xs text-[#484f58] mb-2 uppercase tracking-wider font-medium">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {["AWS", "Python", "TypeScript", "React", "Docker", "Kubernetes",
                "Terraform", "CI/CD", "GitLab", "Jenkins", "Ansible"].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#30363d] bg-[#1c2128] px-2.5 py-0.5 text-xs text-[#8b949e]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <p className="text-xs text-[#484f58] mb-2 uppercase tracking-wider font-medium">Certifications</p>
            <div className="space-y-1">
              {[
                "Certified Kubernetes Administrator (CKA)",
                "AWS Solutions Architect – Associate",
                "AWS Developer – Associate",
              ].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-xs text-[#8b949e]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6] shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-4">
          Feedback
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="https://github.com/vishnuvkm/devtoolkit/issues/new?title=Bug%3A+&labels=bug"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-4 hover:border-[#f85149]/50 hover:bg-[#1c2128] transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2d0f0f] border border-[#f85149]/30">
              <Bug className="h-4 w-4 text-[#f85149]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-1">Report a Bug</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Something broken or not working as expected? Open a GitHub issue and I&apos;ll look into it.
              </p>
            </div>
            <span className="mt-auto text-xs text-[#f85149] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open issue →
            </span>
          </a>

          <a
            href="https://github.com/vishnuvkm/devtoolkit/issues/new?title=Tool+Request%3A+&labels=enhancement"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-4 hover:border-[#3b82f6]/50 hover:bg-[#1c2128] transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0d1e35] border border-[#3b82f6]/30">
              <Lightbulb className="h-4 w-4 text-[#3b82f6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-1">Request a Tool</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Have an idea for a tool that would save you time? Suggest it and it might make the next wave.
              </p>
            </div>
            <span className="mt-auto text-xs text-[#3b82f6] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open issue →
            </span>
          </a>
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
          href="https://github.com/vishnuvkm/devtoolkit"
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
