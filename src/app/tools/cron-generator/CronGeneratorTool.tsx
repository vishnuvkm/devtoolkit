"use client";

import { useState, useMemo } from "react";
import cronstrue from "cronstrue";
import CopyButton from "@/components/CopyButton";
import { RefreshCw, Clock } from "lucide-react";
import { getNextRuns } from "@/lib/cron-utils";

interface CronField {
  label: string;
  placeholder: string;
  description: string;
}

const FIELDS: CronField[] = [
  { label: "Minute", placeholder: "0-59", description: "0–59, */5, 0,30" },
  { label: "Hour", placeholder: "0-23", description: "0–23, */2, 9-17" },
  { label: "Day", placeholder: "1-31", description: "1–31, *, L" },
  { label: "Month", placeholder: "1-12", description: "1–12, JAN-DEC" },
  { label: "Weekday", placeholder: "0-7", description: "0–7 (0=Sun), MON-FRI" },
];

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at 9am", value: "0 9 * * *" },
  { label: "Weekdays at 9am", value: "0 9 * * 1-5" },
  { label: "Every 15 min", value: "*/15 * * * *" },
  { label: "Every Sunday", value: "0 0 * * 0" },
  { label: "1st of month", value: "0 0 1 * *" },
];


export default function CronGeneratorTool() {
  const [parts, setParts] = useState(["0", "9", "*", "*", "1-5"]);
  const [customExpr, setCustomExpr] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const expression = useCustom
    ? customExpr
    : parts.join(" ");

  const humanReadable = useMemo(() => {
    try {
      return cronstrue.toString(expression, { use24HourTimeFormat: false });
    } catch {
      return null;
    }
  }, [expression]);

  const nextRuns = useMemo(() => getNextRuns(expression), [expression]);
  const isValid = humanReadable !== null;

  const applyPreset = (value: string) => {
    const p = value.split(" ");
    setParts(p);
    setCustomExpr(value);
    setUseCustom(false);
  };

  const handleCustomChange = (val: string) => {
    setCustomExpr(val);
    setUseCustom(true);
    const p = val.trim().split(/\s+/);
    if (p.length === 5) setParts(p);
  };

  const updatePart = (idx: number, val: string) => {
    const next = [...parts];
    next[idx] = val || "*";
    setParts(next);
    setUseCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                expression === p.value
                  ? "border-[#3b82f6] bg-[#0d2145] text-[#3b82f6]"
                  : "border-[#30363d] bg-[#1c2128] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setParts(["*", "*", "*", "*", "*"]);
              setCustomExpr("* * * * *");
              setUseCustom(false);
            }}
            className="rounded-full border border-[#30363d] bg-[#1c2128] px-3 py-1 text-xs text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3] transition-colors inline-flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Field inputs */}
      <div>
        <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Field Editor
        </p>
        <div className="grid grid-cols-5 gap-2">
          {FIELDS.map((field, idx) => (
            <div key={field.label}>
              <label className="block text-xs text-[#8b949e] mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={useCustom ? (parts[idx] ?? "*") : parts[idx]}
                onChange={(e) => updatePart(idx, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded border border-[#30363d] bg-[#0d1117] px-2 py-1.5 text-sm font-mono text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-[#484f58] mt-0.5 leading-tight">
                {field.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct expression input */}
      <div>
        <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Expression (edit directly)
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="* * * * *"
          className={`w-full rounded border px-3 py-2 text-sm font-mono placeholder-[#484f58] focus:outline-none transition-colors ${
            isValid
              ? "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
              : "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
          }`}
        />
      </div>

      {/* Output */}
      <div
        className={`rounded-lg border p-4 ${
          isValid
            ? "border-[#3fb950]/30 bg-[#0d2a1a]"
            : "border-[#f85149]/30 bg-[#2a0d0d]"
        }`}
      >
        {isValid ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#484f58] mb-1">Runs:</p>
              <p className="text-sm text-[#3fb950] font-medium">
                {humanReadable}
              </p>
              <p className="text-xs text-[#484f58] mt-1">
                Expression:{" "}
                <code className="text-[#3b82f6] font-mono">{expression}</code>
              </p>
            </div>
            <CopyButton text={expression} label="Copy" />
          </div>
        ) : (
          <p className="text-sm text-[#f85149]">
            Invalid cron expression — check the fields above.
          </p>
        )}
      </div>

      {/* Next run times */}
      {isValid && nextRuns.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Next {nextRuns.length} executions
          </p>
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden">
            {nextRuns.map((run, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                  i > 0 ? "border-t border-[#21262d]" : ""
                }`}
              >
                <span className="text-[#484f58] w-5 shrink-0 text-right text-xs">
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-[#8b949e]">{run}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
