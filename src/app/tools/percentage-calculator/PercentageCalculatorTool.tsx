"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import {
  percentOf,
  whatPercent,
  percentChange,
  addPercent,
  subtractPercent,
  formatNumber,
} from "@/lib/percentage-utils";

function parse(v: string): number | null {
  if (v.trim() === "") return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

const inputClass =
  "w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors";

const labelClass =
  "text-xs font-medium text-[#484f58] uppercase tracking-wider";

export default function PercentageCalculatorTool() {
  // Card 1 — "What is X% of Y?"
  const [m1percent, setM1Percent] = useState("");
  const [m1total, setM1Total] = useState("");

  // Card 2 — "X is what % of Y?"
  const [m2part, setM2Part] = useState("");
  const [m2total, setM2Total] = useState("");

  // Card 3 — "Percentage Change"
  const [m3from, setM3From] = useState("");
  const [m3to, setM3To] = useState("");

  // Card 4 — "Add / Subtract a Percentage"
  const [m4value, setM4Value] = useState("");
  const [m4percent, setM4Percent] = useState("");

  // --- Derived results (all via useMemo, never in render) ---

  const result1 = useMemo(() => {
    const p = parse(m1percent);
    const t = parse(m1total);
    if (p === null || t === null) return null;
    return percentOf(p, t);
  }, [m1percent, m1total]);

  const result2 = useMemo(() => {
    const part = parse(m2part);
    const total = parse(m2total);
    if (part === null || total === null) return null;
    return whatPercent(part, total);
  }, [m2part, m2total]);

  const result3 = useMemo(() => {
    const from = parse(m3from);
    const to = parse(m3to);
    if (from === null || to === null) return null;
    return percentChange(from, to);
  }, [m3from, m3to]);

  const result4Add = useMemo(() => {
    const v = parse(m4value);
    const p = parse(m4percent);
    if (v === null || p === null) return null;
    return addPercent(v, p);
  }, [m4value, m4percent]);

  const result4Sub = useMemo(() => {
    const v = parse(m4value);
    const p = parse(m4percent);
    if (v === null || p === null) return null;
    return subtractPercent(v, p);
  }, [m4value, m4percent]);

  return (
    <div className="space-y-5">
      {/* ── Card 1: What is X% of Y? ── */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 space-y-4">
        <p className={labelClass}>What is X% of Y?</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Percent (%)</label>
            <div className="relative">
              <input
                type="number"
                value={m1percent}
                onChange={(e) => setM1Percent(e.target.value)}
                placeholder="e.g. 15"
                className={inputClass + " pr-8"}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#484f58]">
                %
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Total</label>
            <input
              type="number"
              value={m1total}
              onChange={(e) => setM1Total(e.target.value)}
              placeholder="e.g. 80"
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded bg-[#0d1117] border border-[#21262d] px-4 py-3 flex items-center justify-between gap-3 min-h-[52px]">
          {result1 !== null ? (
            <>
              <div>
                <span className="text-xl font-semibold text-[#3b82f6]">
                  {formatNumber(result1)}
                </span>
                <p className="text-xs text-[#484f58] mt-0.5">
                  {m1percent}% of {m1total} ={" "}
                  <span className="text-[#8b949e]">{formatNumber(result1)}</span>
                </p>
              </div>
              <CopyButton text={formatNumber(result1)} />
            </>
          ) : (
            <span className="text-sm text-[#484f58]">
              Enter both values to calculate
            </span>
          )}
        </div>
      </div>

      {/* ── Card 2: X is what % of Y? ── */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 space-y-4">
        <p className={labelClass}>X is what % of Y?</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Part (X)</label>
            <input
              type="number"
              value={m2part}
              onChange={(e) => setM2Part(e.target.value)}
              placeholder="e.g. 12"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Total (Y)</label>
            <input
              type="number"
              value={m2total}
              onChange={(e) => setM2Total(e.target.value)}
              placeholder="e.g. 80"
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded bg-[#0d1117] border border-[#21262d] px-4 py-3 flex items-center justify-between gap-3 min-h-[52px]">
          {result2 !== null ? (
            <>
              <div>
                <span className="text-xl font-semibold text-[#3b82f6]">
                  {formatNumber(result2)}%
                </span>
                <p className="text-xs text-[#484f58] mt-0.5">
                  {m2part} is{" "}
                  <span className="text-[#8b949e]">{formatNumber(result2)}%</span>{" "}
                  of {m2total}
                </p>
              </div>
              <CopyButton text={`${formatNumber(result2)}%`} />
            </>
          ) : (
            <span className="text-sm text-[#484f58]">
              Enter both values to calculate
            </span>
          )}
        </div>
      </div>

      {/* ── Card 3: Percentage Change ── */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 space-y-4">
        <p className={labelClass}>Percentage Change</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">From</label>
            <input
              type="number"
              value={m3from}
              onChange={(e) => setM3From(e.target.value)}
              placeholder="e.g. 80"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">To</label>
            <input
              type="number"
              value={m3to}
              onChange={(e) => setM3To(e.target.value)}
              placeholder="e.g. 96"
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded bg-[#0d1117] border border-[#21262d] px-4 py-3 flex items-center justify-between gap-3 min-h-[52px]">
          {result3 !== null ? (
            result3.direction === "unchanged" ? (
              <span className="text-sm text-[#484f58]">
                &#8594; No change
              </span>
            ) : (
              <>
                <div>
                  <span
                    className={`text-xl font-semibold ${
                      result3.direction === "increase"
                        ? "text-[#3fb950]"
                        : "text-[#f85149]"
                    }`}
                  >
                    {result3.direction === "increase" ? "↑" : "↓"}{" "}
                    {formatNumber(result3.change)}%
                  </span>
                  <p className="text-xs text-[#484f58] mt-0.5">
                    {m3from} → {m3to} is a{" "}
                    <span className="text-[#8b949e]">
                      {formatNumber(result3.change)}%
                    </span>{" "}
                    {result3.direction}
                  </p>
                </div>
                <CopyButton
                  text={`${result3.direction === "increase" ? "+" : "-"}${formatNumber(result3.change)}%`}
                />
              </>
            )
          ) : (
            <span className="text-sm text-[#484f58]">
              Enter both values to calculate
            </span>
          )}
        </div>
      </div>

      {/* ── Card 4: Add / Subtract a Percentage ── */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 space-y-4">
        <p className={labelClass}>Add / Subtract a Percentage</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Base Value</label>
            <input
              type="number"
              value={m4value}
              onChange={(e) => setM4Value(e.target.value)}
              placeholder="e.g. 80"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e]">Percent (%)</label>
            <div className="relative">
              <input
                type="number"
                value={m4percent}
                onChange={(e) => setM4Percent(e.target.value)}
                placeholder="e.g. 20"
                className={inputClass + " pr-8"}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#484f58]">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Add result */}
          <div className="rounded bg-[#0d1117] border border-[#21262d] px-4 py-3 space-y-2 min-h-[76px]">
            <p className="text-xs font-medium text-[#3fb950] uppercase tracking-wider">
              Add (+{m4percent || "X"}%)
            </p>
            {result4Add !== null ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold text-[#3fb950]">
                  {formatNumber(result4Add)}
                </span>
                <CopyButton text={formatNumber(result4Add)} />
              </div>
            ) : (
              <span className="text-sm text-[#484f58]">—</span>
            )}
          </div>

          {/* Subtract result */}
          <div className="rounded bg-[#0d1117] border border-[#21262d] px-4 py-3 space-y-2 min-h-[76px]">
            <p className="text-xs font-medium text-[#f85149] uppercase tracking-wider">
              Subtract (−{m4percent || "X"}%)
            </p>
            {result4Sub !== null ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold text-[#f85149]">
                  {formatNumber(result4Sub)}
                </span>
                <CopyButton text={formatNumber(result4Sub)} />
              </div>
            ) : (
              <span className="text-sm text-[#484f58]">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
