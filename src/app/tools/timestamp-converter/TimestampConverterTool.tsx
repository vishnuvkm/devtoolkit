"use client";

import { useState, useMemo, useEffect } from "react";
import CopyButton from "@/components/CopyButton";
import { RefreshCw, AlertCircle } from "lucide-react";
import { timeAgo, parseTimestamp, formatInZone } from "@/lib/timestamp-utils";

const TIMEZONES = [
  { id: "UTC", label: "UTC" },
  { id: "America/New_York", label: "New York (ET)" },
  { id: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { id: "Europe/London", label: "London (GMT/BST)" },
  { id: "Europe/Paris", label: "Paris (CET)" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Tokyo", label: "Tokyo (JST)" },
  { id: "Asia/Shanghai", label: "Shanghai (CST)" },
  { id: "Australia/Sydney", label: "Sydney (AEST)" },
];

function formatIso(ms: number): string {
  return new Date(ms).toISOString();
}

export default function TimestampConverterTool() {
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [nowMs, setNowMs] = useState(Date.now());

  // Live clock for "Now" display
  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const { ms: targetMs, error } = useMemo(() => parseTimestamp(input), [input]);

  const isMs = useMemo(() => {
    const n = parseInt(input.trim(), 10);
    return /^\d+$/.test(input.trim()) && input.trim().length >= 13 && !isNaN(n);
  }, [input]);

  const setNow = () => setInput(String(Math.floor(Date.now() / 1000)));

  return (
    <div className="space-y-5">
      {/* Live "now" banner */}
      <div className="flex items-center justify-between rounded border border-[#30363d] bg-[#0d1117] px-4 py-2.5">
        <div>
          <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Current Unix time
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="font-mono text-lg font-bold text-[#3b82f6]">
              {Math.floor(nowMs / 1000)}
            </span>
            <span className="font-mono text-sm text-[#8b949e]">
              {nowMs}ms
            </span>
          </div>
        </div>
        <CopyButton text={String(Math.floor(nowMs / 1000))} label="Copy" />
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Timestamp or Date
          </label>
          <button
            onClick={setNow}
            className="inline-flex items-center gap-1 text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Use now
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className={`w-full rounded border px-3 py-2.5 font-mono text-sm placeholder-[#484f58] focus:outline-none transition-colors ${
            error
              ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
              : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
          }`}
          placeholder="1700000000  or  2024-01-15T12:00:00Z"
        />
        {error && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#f85149]">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}
        {targetMs !== null && (
          <p className="mt-1 text-xs text-[#484f58]">
            Interpreted as:{" "}
            <span className="text-[#8b949e]">
              {isMs ? "milliseconds" : "seconds"}
            </span>{" "}
            →{" "}
            <span className="text-[#e6edf3]">{timeAgo(targetMs)}</span>
          </p>
        )}
      </div>

      {/* Conversions */}
      {targetMs !== null && (
        <div className="space-y-3">
          {/* Quick formats */}
          <div className="rounded border border-[#30363d] bg-[#0d1117] divide-y divide-[#21262d]">
            {[
              {
                label: "Unix (seconds)",
                value: String(Math.floor(targetMs / 1000)),
              },
              {
                label: "Unix (milliseconds)",
                value: String(targetMs),
              },
              {
                label: "ISO 8601",
                value: formatIso(targetMs),
              },
              {
                label: "Relative",
                value: timeAgo(targetMs),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider w-40 shrink-0">
                  {label}
                </span>
                <span className="flex-1 font-mono text-sm text-[#e6edf3] break-all">
                  {value}
                </span>
                <CopyButton text={value} />
              </div>
            ))}
          </div>

          {/* Timezone table */}
          <div>
            <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
              Timezones
            </p>
            <div className="rounded border border-[#30363d] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#30363d] bg-[#161b22]">
                    <th className="text-left text-xs font-medium text-[#484f58] px-3 py-2 w-44">
                      Timezone
                    </th>
                    <th className="text-left text-xs font-medium text-[#484f58] px-3 py-2">
                      Local time
                    </th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {TIMEZONES.map(({ id, label }, i) => {
                    const formatted = formatInZone(targetMs, id);
                    return (
                      <tr
                        key={id}
                        className={
                          i < TIMEZONES.length - 1 ? "border-b border-[#21262d]" : ""
                        }
                      >
                        <td className="px-3 py-2 text-xs text-[#8b949e]">{label}</td>
                        <td className="px-3 py-2 font-mono text-xs text-[#e6edf3]">
                          {formatted}
                        </td>
                        <td className="px-3 py-2">
                          <CopyButton text={formatted} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
