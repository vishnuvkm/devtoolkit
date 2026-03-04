"use client";

import { useState, useMemo } from "react";
import { calculateAge, formatAge } from "@/lib/age-utils";

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-md border p-4 text-center ${highlight ? "border-[#3b82f6]/50 bg-[#1e3a5f]/30" : "border-[#30363d] bg-[#161b22]"}`}>
      <div className={`text-2xl font-bold font-mono ${highlight ? "text-[#3b82f6]" : "text-[#e6edf3]"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-[#8b949e]">{label}</div>
    </div>
  );
}

export default function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState("");

  // Get today as YYYY-MM-DD for max attribute
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const result = useMemo(() => {
    if (!birthDate) return null;
    return calculateAge(birthDate);
  }, [birthDate]);

  const ageLabel = useMemo(() => {
    if (!result) return null;
    return formatAge(result);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Date input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
          Date of Birth
        </label>
        <input
          type="date"
          value={birthDate}
          max={todayStr}
          onChange={(e) => setBirthDate(e.target.value)}
          className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-base text-[#e6edf3] focus:outline-none focus:border-[#3b82f6] [color-scheme:dark]"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Happy birthday banner */}
          {result.isToday && (
            <div className="rounded-md border border-[#d29922]/50 bg-[#2a1f0d] px-4 py-3 text-sm text-[#d29922]">
              🎂 Happy Birthday! You are {result.years} year{result.years !== 1 ? "s" : ""} old today!
            </div>
          )}

          {/* Main age display */}
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 text-center">
            <div className="text-4xl font-bold text-[#e6edf3]">{result.years}</div>
            <div className="mt-1 text-sm text-[#8b949e]">years old</div>
            <div className="mt-3 text-base text-[#8b949e]">{ageLabel}</div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total Days" value={result.totalDays.toLocaleString()} />
            <StatCard label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
            <StatCard
              label={result.isToday ? "🎂 Birthday Today!" : "Days to Birthday"}
              value={result.isToday ? "0" : result.nextBirthdayDays.toLocaleString()}
              highlight={!result.isToday}
            />
            <StatCard label="Next Birthday" value={result.nextBirthdayDate} />
          </div>

          {/* Breakdown */}
          <div className="rounded-md border border-[#30363d] bg-[#161b22] p-4">
            <h3 className="mb-3 text-xs font-medium text-[#8b949e] uppercase tracking-wide">
              Exact Breakdown
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
      {!birthDate && (
        <div className="rounded-md border border-dashed border-[#30363d] py-12 text-center text-sm text-[#484f58]">
          Enter your date of birth above to calculate your age
        </div>
      )}

      {/* Invalid state (future date not caught by max attr) */}
      {birthDate && !result && (
        <div className="rounded-md border border-[#f85149]/50 bg-[#2d0f0f] px-4 py-3 text-sm text-[#f85149]">
          Please enter a valid date of birth (cannot be in the future).
        </div>
      )}
    </div>
  );
}
