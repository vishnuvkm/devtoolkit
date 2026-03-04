"use client";

import { useState, useMemo } from "react";
import { CaseSensitive } from "lucide-react";
import { convertAll, CASE_OPTIONS } from "@/lib/case-utils";
import CopyButton from "@/components/CopyButton";

export default function CaseConverterTool() {
  const [input, setInput] = useState("The quick brown fox");

  const conversions = useMemo(() => convertAll(input), [input]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">
          Input text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Type or paste your text here..."
          className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none"
        />
      </div>

      {/* Conversions grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CASE_OPTIONS.map((opt) => {
          const converted = conversions[opt.type] ?? "";
          return (
            <div
              key={opt.type}
              className="rounded-lg border border-[#30363d] bg-[#161b22] p-3"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#484f58] uppercase tracking-wider">
                  {opt.label}
                </span>
                <CopyButton text={converted} />
              </div>
              <p className="break-all font-mono text-sm text-[#e6edf3] min-h-[1.25rem]">
                {converted || (
                  <span className="text-[#484f58]">{opt.example}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#484f58]">
          How it works
        </h3>
        <p className="text-xs text-[#8b949e] leading-relaxed">
          Paste any text — with spaces, underscores, hyphens, or camelCase — and all 10 case formats are generated instantly.
          Useful for variable names, API keys, file names, CSS classes, and more.
        </p>
      </div>
    </div>
  );
}
