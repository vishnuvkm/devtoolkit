"use client";

import { useState, useCallback } from "react";
import CopyButton from "@/components/CopyButton";
import { RefreshCw, Copy, Check } from "lucide-react";
import { generateUuids } from "@/lib/uuid-utils";

const COUNT_OPTIONS = [1, 5, 10, 25, 50, 100];

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(5, false));
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    setUuids(generateUuids(count, uppercase));
  }, [count, uppercase]);

  const handleCountChange = (n: number) => {
    setCount(n);
    setUuids(generateUuids(n, uppercase));
  };

  const handleCaseChange = (upper: boolean) => {
    setUppercase(upper);
    setUuids((prev) => prev.map((u) => (upper ? u.toUpperCase() : u.toLowerCase())));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Count selector */}
        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Count
          </label>
          <div className="flex rounded border border-[#30363d] overflow-hidden">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => handleCountChange(n)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-r border-[#30363d] last:border-r-0 ${
                  count === n
                    ? "bg-[#1e3a5f] text-[#3b82f6]"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Case toggle */}
        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Format
          </label>
          <div className="flex rounded border border-[#30363d] overflow-hidden">
            {([false, true] as const).map((upper) => (
              <button
                key={String(upper)}
                onClick={() => handleCaseChange(upper)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-[#30363d] last:border-r-0 ${
                  uppercase === upper
                    ? "bg-[#1e3a5f] text-[#3b82f6]"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]"
                }`}
              >
                {upper ? "UPPERCASE" : "lowercase"}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-auto flex items-end gap-2">
          <button
            onClick={copyAll}
            className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-all ${
              copiedAll
                ? "border-[#3fb950]/30 bg-[#0d2a1a] text-[#3fb950]"
                : "border-[#30363d] bg-[#1c2128] text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            {copiedAll ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copiedAll ? "Copied!" : `Copy all ${count}`}
          </button>
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#1c2128] px-3 py-1.5 text-xs font-medium text-[#8b949e] transition-all hover:text-[#e6edf3] hover:border-[#3b82f6]/30"
          >
            <RefreshCw className="h-3 w-3" />
            Regenerate
          </button>
        </div>
      </div>

      {/* UUID list */}
      <div className="space-y-1.5">
        {uuids.map((uuid, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 group hover:border-[#3b82f6]/30 transition-colors"
          >
            <span className="font-mono text-sm text-[#e6edf3] select-all">
              {uuid}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={uuid} />
            </div>
          </div>
        ))}
      </div>

      {/* Version info */}
      <p className="text-xs text-[#484f58]">
        Generated using{" "}
        <code className="text-[#8b949e]">crypto.randomUUID()</code> — UUID
        version 4 (random). All{" "}
        <span className="text-[#e6edf3]">{count}</span>{" "}
        {count === 1 ? "UUID is" : "UUIDs are"} unique and cryptographically
        random.
      </p>
    </div>
  );
}
