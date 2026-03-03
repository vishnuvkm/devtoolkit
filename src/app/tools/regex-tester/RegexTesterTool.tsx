"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { AlertCircle } from "lucide-react";
import { findMatches } from "@/lib/regex-utils";

const CHEAT_SHEET = [
  { pattern: ".", desc: "Any character except newline" },
  { pattern: "\\d", desc: "Digit [0-9]" },
  { pattern: "\\D", desc: "Non-digit" },
  { pattern: "\\w", desc: "Word char [a-zA-Z0-9_]" },
  { pattern: "\\W", desc: "Non-word char" },
  { pattern: "\\s", desc: "Whitespace" },
  { pattern: "\\S", desc: "Non-whitespace" },
  { pattern: "^", desc: "Start of string/line" },
  { pattern: "$", desc: "End of string/line" },
  { pattern: "*", desc: "0 or more" },
  { pattern: "+", desc: "1 or more" },
  { pattern: "?", desc: "0 or 1 (optional)" },
  { pattern: "{n}", desc: "Exactly n times" },
  { pattern: "{n,m}", desc: "Between n and m times" },
  { pattern: "[abc]", desc: "Character class (a, b, or c)" },
  { pattern: "[^abc]", desc: "Negated character class" },
  { pattern: "(abc)", desc: "Capturing group" },
  { pattern: "(?:abc)", desc: "Non-capturing group" },
  { pattern: "a|b", desc: "Alternation (a or b)" },
  { pattern: "(?=abc)", desc: "Positive lookahead" },
  { pattern: "(?!abc)", desc: "Negative lookahead" },
];

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
  { label: "Hex color", pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b", flags: "g" },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("[a-z]+");
  const [flags, setFlags] = useState("gi");
  const [testStr, setTestStr] = useState(
    "Hello World! Testing regex patterns in devtools-kit."
  );

  const { matches, error, highlighted } = useMemo(() => {
    const noHighlight = escapeHtml(testStr);
    if (!pattern.trim()) return { matches: [], error: null, highlighted: noHighlight };

    const { matches: found, error: err } = findMatches(pattern, flags, testStr);
    if (err) return { matches: [], error: err, highlighted: noHighlight };

    // Build highlighted HTML
    let html = "";
    let cursor = 0;
    const colors = ["bg-[#1e3a5f] text-[#93c5fd]", "bg-[#2d1f0a] text-[#fbbf24]"];
    let colorIdx = 0;
    for (const match of found) {
      if (match.index > cursor) html += escapeHtml(testStr.slice(cursor, match.index));
      const cls = colors[colorIdx % colors.length];
      html += `<mark class="${cls} rounded px-0.5">${escapeHtml(match.value)}</mark>`;
      cursor = match.index + match.value.length;
      colorIdx++;
    }
    html += escapeHtml(testStr.slice(cursor));

    return { matches: found, error: null, highlighted: html };
  }, [pattern, flags, testStr]);

  const FLAG_OPTIONS = ["g", "i", "m", "s"];

  const toggleFlag = (f: string) => {
    setFlags((prev) =>
      prev.includes(f) ? prev.replace(f, "") : prev + f
    );
  };

  return (
    <div className="space-y-5">
      {/* Pattern + flags */}
      <div>
        <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
          Pattern
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58] font-mono text-sm select-none">
              /
            </span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className={`w-full rounded border pl-6 pr-3 py-2 font-mono text-sm focus:outline-none transition-colors ${
                error
                  ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
                  : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
              }`}
              placeholder="regex pattern"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#484f58] font-mono text-sm select-none">
              /
            </span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
              className="w-20 rounded border border-[#30363d] bg-[#0d1117] pl-5 pr-2 py-2 font-mono text-sm text-[#e6edf3] focus:border-[#3b82f6] focus:outline-none transition-colors"
              placeholder="gi"
            />
          </div>
        </div>
        {error && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#f85149]">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {/* Flag toggles */}
        <div className="mt-2 flex gap-2">
          {FLAG_OPTIONS.map((f) => {
            const labels: Record<string, string> = {
              g: "Global",
              i: "Insensitive",
              m: "Multiline",
              s: "Dotall",
            };
            return (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`rounded px-2 py-0.5 text-xs font-mono transition-colors ${
                  flags.includes(f)
                    ? "bg-[#3b82f6] text-white"
                    : "border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3]"
                }`}
                title={labels[f]}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick examples */}
      <div>
        <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Examples
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setPattern(ex.pattern);
                setFlags(ex.flags);
              }}
              className="rounded-full border border-[#30363d] bg-[#1c2128] px-3 py-1 text-xs text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3] transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Test String
          </label>
          <span className="text-xs text-[#484f58]">
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </span>
        </div>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full rounded border border-[#30363d] bg-[#0d1117] font-mono text-sm leading-relaxed px-3 py-2.5 text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none resize-none transition-colors"
          placeholder="Enter text to test against…"
        />
      </div>

      {/* Highlighted output */}
      {testStr && (
        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Highlighted Matches
          </label>
          <div
            className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 font-mono text-sm leading-relaxed text-[#e6edf3] whitespace-pre-wrap break-words min-h-[80px]"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Match list */}
      {matches.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Match List
          </label>
          <div className="rounded border border-[#30363d] bg-[#0d1117] divide-y divide-[#21262d] max-h-48 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2 text-xs">
                <span className="text-[#484f58] w-5 shrink-0 text-right">
                  {i + 1}
                </span>
                <code className="text-[#3b82f6] font-mono break-all">
                  {m.value}
                </code>
                <span className="text-[#484f58] ml-auto shrink-0">
                  @{m.index}
                </span>
                {m.groups.some(Boolean) && (
                  <span className="text-[#8b949e]">
                    [{m.groups.join(", ")}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cheat sheet */}
      <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-[#484f58] uppercase tracking-wider hover:text-[#8b949e] transition-colors list-none flex items-center gap-1.5">
          <span className="group-open:rotate-90 inline-block transition-transform">
            ▶
          </span>
          Regex Cheat Sheet
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 rounded border border-[#30363d] bg-[#0d1117] p-3">
          {CHEAT_SHEET.map(({ pattern: p, desc }) => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className="flex items-center gap-3 rounded px-2 py-1.5 text-left hover:bg-[#1c2128] transition-colors group/item"
            >
              <code className="text-[#3b82f6] font-mono text-xs w-20 shrink-0">
                {p}
              </code>
              <span className="text-[10px] text-[#8b949e]">{desc}</span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
