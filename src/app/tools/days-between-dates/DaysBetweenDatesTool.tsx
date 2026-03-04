"use client";

import { useState, useMemo } from "react";
import { daysBetween } from "@/lib/date-diff-utils";

function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-4 text-center ${
        highlight
          ? "border-[#3b82f6]/50 bg-[#1e3a5f]/30"
          : "border-[#30363d] bg-[#161b22]"
      }`}
    >
      <div
        className={`text-2xl font-bold font-mono ${
          highlight ? "text-[#3b82f6]" : "text-[#e6edf3]"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-[#8b949e]">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-[#484f58]">{sub}</div>}
    </div>
  );
}

export default function DaysBetweenDatesTool() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    return daysBetween(startDate, endDate);
  }, [startDate, endDate]);

  function swapDates() {
    setStartDate(endDate);
    setEndDate(startDate);
  }

  function setToday(which: "start" | "end") {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const today = `${y}-${m}-${d}`;
    if (which === "start") setStartDate(today);
    else setEndDate(today);
  }

  return (
    <div className="space-y-6">
      {/* Date inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* Start date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#e6edf3]">Start Date</label>
            <button
              onClick={() => setToday("start")}
              className="text-xs text-[#3b82f6] hover:underline"
            >
              Today
            </button>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#3b82f6] [color-scheme:dark]"
          />
        </div>

        {/* Swap button */}
        <div className="flex items-end justify-center pb-2">
          <button
            onClick={swapDates}
            disabled={!startDate && !endDate}
            className="rounded-full border border-[#30363d] p-2 text-[#8b949e] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors disabled:opacity-40"
            title="Swap dates"
          >
            ⇄
          </button>
        </div>

        {/* End date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#e6edf3]">End Date</label>
            <button
              onClick={() => setToday("end")}
              className="text-xs text-[#3b82f6] hover:underline"
            >
              Today
            </button>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#3b82f6] [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Reversed date warning */}
      {result?.isNegative && (
        <div className="rounded-md border border-[#d29922]/50 bg-[#2a1f0d] px-4 py-3 text-sm text-[#d29922]">
          ⚠ End date is before start date — showing the absolute difference.
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main label */}
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 text-center">
            <div className="text-3xl font-bold font-mono text-[#e6edf3]">
              {result.totalDays.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-[#8b949e]">total days</div>
            <div className="mt-3 text-base text-[#8b949e]">{result.label}</div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Working Days"
              value={result.workingDays.toLocaleString()}
              sub="Mon – Fri"
              highlight
            />
            <StatCard
              label="Weekend Days"
              value={result.weekendDays.toLocaleString()}
              sub="Sat & Sun"
            />
            <StatCard
              label="Total Weeks"
              value={result.totalWeeks.toLocaleString()}
              sub={result.remainingDays > 0 ? `+${result.remainingDays} day${result.remainingDays !== 1 ? "s" : ""}` : "exactly"}
            />
            <StatCard
              label="Months"
              value={(result.years * 12 + result.months).toLocaleString()}
              sub="approximate"
            />
          </div>

          {/* Breakdown */}
          <div className="rounded-md border border-[#30363d] bg-[#161b22] p-4">
            <h3 className="mb-3 text-xs font-medium text-[#8b949e] uppercase tracking-wide">
              Date Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Years", value: result.years },
                { label: "Months", value: result.months },
                { label: "Days", value: result.days },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xl font-mono font-semibold text-[#e6edf3]">{value}</div>
                  <div className="text-xs text-[#484f58]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!startDate && !endDate && (
        <div className="rounded-md border border-dashed border-[#30363d] py-12 text-center text-sm text-[#484f58]">
          Select a start and end date to calculate the difference
        </div>
      )}
    </div>
  );
}
