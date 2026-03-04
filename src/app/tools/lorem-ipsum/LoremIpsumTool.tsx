"use client";

import { useState, useMemo } from "react";
import { generateLorem, wordCount, charCount, LoremUnit, LoremFormat } from "@/lib/lorem-utils";
import CopyButton from "@/components/CopyButton";

const UNITS: { value: LoremUnit; label: string; max: number }[] = [
  { value: "paragraphs", label: "Paragraphs", max: 20 },
  { value: "sentences",  label: "Sentences",  max: 50 },
  { value: "words",      label: "Words",      max: 500 },
];

const FORMATS: { value: LoremFormat; label: string }[] = [
  { value: "plain",    label: "Plain Text" },
  { value: "html",     label: "HTML" },
  { value: "markdown", label: "Markdown" },
];

export default function LoremIpsumTool() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [format, setFormat] = useState<LoremFormat>("plain");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const currentUnitInfo = UNITS.find((u) => u.value === unit)!;

  const output = useMemo(
    () => generateLorem({ unit, count, format, startWithLorem }),
    [unit, count, format, startWithLorem]
  );

  const wc = useMemo(() => wordCount(output), [output]);
  const cc = useMemo(() => charCount(output), [output]);

  function handleUnitChange(newUnit: LoremUnit) {
    setUnit(newUnit);
    const unitInfo = UNITS.find((u) => u.value === newUnit)!;
    setCount(Math.min(count, unitInfo.max));
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Unit selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
            Generate by
          </label>
          <div className="flex gap-2">
            {UNITS.map((u) => (
              <button
                key={u.value}
                onClick={() => handleUnitChange(u.value)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  unit === u.value
                    ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                    : "border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
            Count: {count}
          </label>
          <input
            type="range"
            min={1}
            max={currentUnitInfo.max}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-[#3b82f6]"
          />
          <div className="mt-1 flex justify-between text-xs text-[#484f58]">
            <span>1</span>
            <span>{currentUnitInfo.max}</span>
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
            Format
          </label>
          <div className="flex flex-col gap-1.5">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium text-left transition-colors ${
                  format === f.value
                    ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                    : "border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classic start toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`h-5 w-9 rounded-full transition-colors ${
              startWithLorem ? "bg-[#3b82f6]" : "bg-[#30363d]"
            }`}
          />
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              startWithLorem ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-[#8b949e]">
          Start with &ldquo;Lorem ipsum dolor sit amet…&rdquo;
        </span>
      </label>

      {/* Output */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-4 text-xs text-[#484f58]">
            <span>{wc} words</span>
            <span>{cc} characters</span>
          </div>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          rows={12}
          className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:outline-none resize-y font-mono leading-relaxed"
        />
      </div>
    </div>
  );
}
