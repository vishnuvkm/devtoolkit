"use client";

import { useState, useMemo } from "react";
import { analyzeText } from "@/lib/word-counter-utils";

const CHAR_LIMITS = [
  { label: "Twitter/X", limit: 280 },
  { label: "SMS", limit: 160 },
  { label: "Meta Description", limit: 160 },
];

function getLimitColor(chars: number, limit: number): { dot: string; text: string; bg: string } {
  const ratio = chars / limit;
  if (ratio >= 1) {
    return { dot: "bg-[#f85149]", text: "text-[#f85149]", bg: "bg-[#2a0d0d] border-[#f85149]/30" };
  }
  if (ratio >= 0.85) {
    return { dot: "bg-[#d29922]", text: "text-[#d29922]", bg: "bg-[#2a1d0a] border-[#d29922]/30" };
  }
  return { dot: "bg-[#3fb950]", text: "text-[#3fb950]", bg: "bg-[#0d2a1a] border-[#3fb950]/30" };
}

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className="rounded-md border border-[#30363d] bg-[#161b22] p-4 flex flex-col gap-1">
      <span
        className={`text-2xl font-bold tabular-nums leading-none ${
          accent ? "text-[#3b82f6]" : "text-[#e6edf3]"
        }`}
      >
        {value}
      </span>
      <span className="text-xs text-[#8b949e]">{label}</span>
    </div>
  );
}

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const analysis = useMemo(() => analyzeText(text), [text]);

  const readingTimeDisplay =
    analysis.readingTimeMinutes === 0
      ? "0 min"
      : analysis.readingTimeMinutes === 1
      ? "1 min"
      : `${analysis.readingTimeMinutes} min`;

  return (
    <div className="space-y-5">
      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Your Text
          </label>
          {text.length > 0 && (
            <button
              onClick={() => setText("")}
              className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[280px] resize-y rounded-md border border-[#30363d] bg-[#0d1117] p-4 font-mono text-sm text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          placeholder="Paste or type your text here…"
          spellCheck={false}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Words" value={analysis.words} accent />
        <StatCard label="Characters" value={analysis.characters} />
        <StatCard label="No-Space Chars" value={analysis.charactersNoSpaces} />
        <StatCard label="Sentences" value={analysis.sentences} />
        <StatCard label="Paragraphs" value={analysis.paragraphs} />
        <StatCard label="Reading Time" value={readingTimeDisplay} />
        <StatCard label="Unique Words" value={analysis.uniqueWords} />
        <StatCard
          label="Avg Word Length"
          value={
            analysis.words > 0
              ? (analysis.charactersNoSpaces / analysis.words).toFixed(1)
              : "0"
          }
        />
      </div>

      {/* Top Words */}
      {analysis.topWords.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
            Most Frequent Words
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.topWords.map(({ word, count }) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#1c2128] px-3 py-1 text-sm text-[#e6edf3]"
              >
                <span className="font-medium">{word}</span>
                <span className="text-[#484f58]">×</span>
                <span className="text-[#3b82f6] font-mono">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Character Limit Reference */}
      <div>
        <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Character Limit Reference
        </p>
        <div className="flex flex-wrap gap-2">
          {CHAR_LIMITS.map(({ label, limit }) => {
            const chars = analysis.characters;
            const colors = getLimitColor(chars, limit);
            const over = chars > limit;
            return (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs ${colors.bg}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${colors.dot}`}
                />
                <span className="text-[#8b949e]">{label}:</span>
                <span className={`font-mono font-medium ${colors.text}`}>
                  {over ? `+${chars - limit}` : `${chars}/${limit}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
