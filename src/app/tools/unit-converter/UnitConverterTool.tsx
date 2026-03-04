"use client";

import { useState, useMemo } from "react";
import {
  convert,
  formatResult,
  getCategories,
  getUnits,
  CATEGORY_LABELS,
  UnitCategory,
} from "@/lib/unit-utils";
import CopyButton from "@/components/CopyButton";

export default function UnitConverterTool() {
  const categories = useMemo(() => getCategories(), []);
  const [category, setCategory] = useState<UnitCategory>("length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  const units = useMemo(() => getUnits(category), [category]);

  // When category changes, reset units to first two in category
  function handleCategoryChange(cat: UnitCategory) {
    setCategory(cat);
    const u = getUnits(cat);
    setFromUnit(u[0]?.id ?? "");
    setToUnit(u[1]?.id ?? "");
  }

  const numericValue = useMemo(() => {
    const n = parseFloat(inputValue);
    return isNaN(n) ? 0 : n;
  }, [inputValue]);

  const result = useMemo(
    () => convert(numericValue, fromUnit, toUnit, category),
    [numericValue, fromUnit, toUnit, category]
  );

  const resultStr = useMemo(() => formatResult(result), [result]);

  // All conversions from input for reference table
  const allConversions = useMemo(
    () =>
      units.map((u) => ({
        ...u,
        result: formatResult(convert(numericValue, fromUnit, u.id, category)),
      })),
    [units, numericValue, fromUnit, category]
  );

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  const fromLabel = units.find((u) => u.id === fromUnit)?.label ?? fromUnit;
  const toLabel = units.find((u) => u.id === toUnit)?.label ?? toUnit;

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              cat === category
                ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                : "border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Main converter */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* From */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#8b949e] uppercase tracking-wide">
            From
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:outline-none focus:border-[#3b82f6]"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-lg font-mono text-[#e6edf3] focus:outline-none focus:border-[#3b82f6]"
            placeholder="Enter value"
          />
        </div>

        {/* Swap button */}
        <div className="flex items-center justify-center pt-8">
          <button
            onClick={swapUnits}
            className="rounded-full border border-[#30363d] p-2 text-[#8b949e] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
            title="Swap units"
          >
            &#8644;
          </button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#8b949e] uppercase tracking-wide">
            To
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:outline-none focus:border-[#3b82f6]"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 rounded-md border border-[#3b82f6]/30 bg-[#1e3a5f]/30 px-3 py-2">
            <span className="flex-1 text-lg font-mono text-[#3b82f6] font-semibold">
              {resultStr}
            </span>
            <CopyButton text={resultStr} />
          </div>
        </div>
      </div>

      {/* Equation label */}
      <p className="text-center text-sm text-[#484f58]">
        {inputValue || "0"} {fromLabel} ={" "}
        <span className="text-[#e6edf3]">{resultStr}</span> {toLabel}
      </p>

      {/* Reference table */}
      <div>
        <h3 className="mb-3 text-xs font-medium text-[#8b949e] uppercase tracking-wide">
          All {CATEGORY_LABELS[category]} conversions from {inputValue || "0"} {fromLabel}
        </h3>
        <div className="overflow-hidden rounded-md border border-[#30363d]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363d] bg-[#161b22]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#8b949e]">Unit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#8b949e]">Value</th>
              </tr>
            </thead>
            <tbody>
              {allConversions.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-[#30363d] last:border-0 ${
                    u.id === toUnit ? "bg-[#1e3a5f]/30" : i % 2 === 0 ? "" : "bg-[#161b22]/50"
                  }`}
                >
                  <td className="px-4 py-2 text-[#e6edf3]">
                    {u.label}
                    {u.id === toUnit && (
                      <span className="ml-2 text-xs text-[#3b82f6]">&larr; selected</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-[#8b949e]">
                    {u.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
