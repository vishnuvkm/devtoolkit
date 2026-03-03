"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { AlertCircle } from "lucide-react";
import { parseSubnet } from "@/lib/subnet";

const EXAMPLES = ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12", "192.168.100.128/26", "10.10.0.0/16"];

function Row({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-center py-2 border-b border-[#21262d] last:border-b-0">
      <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`flex-1 text-sm text-[#e6edf3] break-all ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function SubnetCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24");

  const { result, error } = useMemo(() => parseSubnet(input), [input]);

  const hasError = !!error && input.trim() !== "";

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            CIDR Block
          </label>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="text-xs text-[#484f58] hover:text-[#3b82f6] font-mono transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="e.g. 192.168.1.0/24"
          className={`w-full rounded border px-3 py-2.5 font-mono text-sm placeholder-[#484f58] focus:outline-none transition-colors ${
            hasError
              ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
              : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
          }`}
        />
        {hasError && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#f85149]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Hosts", value: result.totalHosts.toLocaleString() },
              { label: "Usable Hosts", value: result.usableHosts.toLocaleString() },
              { label: "Prefix Length", value: `/${result.prefix}` },
              { label: "IP Class", value: result.ipClass },
            ].map(({ label, value }) => (
              <div key={label} className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-center">
                <div className="text-xs text-[#484f58] mb-1">{label}</div>
                <div className="font-mono text-sm font-semibold text-[#3b82f6]">{value}</div>
              </div>
            ))}
          </div>

          {/* Detail table */}
          <div className="rounded border border-[#30363d] bg-[#0d1117] px-4">
            <Row label="Network Address" value={result.network} />
            <Row label="Broadcast Address" value={result.broadcast} />
            <Row label="Subnet Mask" value={result.mask} />
            <Row label="Wildcard Mask" value={result.wildcardMask} />
            <Row label="First Usable Host" value={result.firstHost} />
            <Row label="Last Usable Host" value={result.lastHost} />
            <Row label="CIDR Notation" value={result.cidr} />
            <Row label="Binary Mask" value={result.binaryMask} />
          </div>

          {/* Visual subnet bar */}
          <div>
            <p className="text-xs text-[#484f58] uppercase tracking-wider mb-2 font-medium">
              Address Space Breakdown
            </p>
            <div className="flex rounded overflow-hidden h-6 text-xs font-mono">
              <div
                className="bg-[#1e3a5f] text-[#79c0ff] flex items-center justify-center overflow-hidden"
                style={{ width: `${(result.prefix / 32) * 100}%`, minWidth: result.prefix > 0 ? "2px" : "0" }}
                title={`Network bits (/${result.prefix})`}
              >
                {result.prefix >= 8 && <span className="px-1 truncate">Network ({result.prefix} bits)</span>}
              </div>
              <div
                className="bg-[#1a3a2a] text-[#3fb950] flex items-center justify-center overflow-hidden"
                style={{ width: `${((32 - result.prefix) / 32) * 100}%`, minWidth: 32 - result.prefix > 0 ? "2px" : "0" }}
                title={`Host bits (${32 - result.prefix})`}
              >
                {32 - result.prefix >= 8 && <span className="px-1 truncate">Host ({32 - result.prefix} bits)</span>}
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-[#484f58] mt-1">
              <span>Bit 1</span>
              {result.prefix > 0 && result.prefix < 32 && (
                <span>Bit {result.prefix} / {result.prefix + 1}</span>
              )}
              <span>Bit 32</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
