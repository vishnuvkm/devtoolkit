"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import {
  generatePassword,
  generateMultiple,
  calcStrength,
} from "@/lib/password-utils";

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [counter, setCounter] = useState(0);
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);

  const password = useMemo(() => {
    try {
      return generatePassword({
        length,
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeAmbiguous,
      });
    } catch {
      return "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, length, uppercase, lowercase, numbers, symbols, excludeAmbiguous]);

  const strength = useMemo(() => calcStrength(password), [password]);

  const noCharsetSelected = !uppercase && !lowercase && !numbers && !symbols;

  const handleGenerate = () => {
    setCounter((c) => c + 1);
  };

  const handleGenerateMultiple = () => {
    try {
      const pws = generateMultiple(bulkCount, {
        length,
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeAmbiguous,
      });
      setBulkPasswords(pws);
    } catch {
      setBulkPasswords([]);
    }
  };

  const strengthBarWidth = `${((strength.score + 1) / 5) * 100}%`;

  return (
    <div className="space-y-5">
      {/* Password Display */}
      <div className="space-y-3">
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 min-h-[56px] flex items-center">
          <span className="font-mono text-lg text-[#e6edf3] break-all select-all flex-1">
            {password || (
              <span className="text-[#484f58] text-sm font-sans">
                Select at least one character type
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={noCharsetSelected}
            className="flex items-center gap-2 rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4" />
            Generate
          </button>
          {password && <CopyButton text={password} label="Copy Password" />}
        </div>
      </div>

      {/* Strength Meter */}
      {noCharsetSelected ? (
        <div className="rounded-md border border-[#f85149]/30 bg-[#2a1115] px-4 py-3 text-sm text-[#f85149]">
          Select at least one character type to generate a password.
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[#30363d] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: strengthBarWidth,
                backgroundColor: strength.color,
              }}
            />
          </div>
          <p className="text-xs font-medium" style={{ color: strength.color }}>
            Strength: {strength.label} ({strength.entropyBits.toFixed(1)} bits
            entropy)
          </p>
        </div>
      )}

      {/* Options Panel */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#484f58]">
          Options
        </h2>

        {/* Length */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#e6edf3]">
              Length:{" "}
              <span className="text-[#3b82f6] font-mono">{length}</span>
            </label>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            step={1}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[#3b82f6] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#484f58]">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Character Types */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Character Types
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-[#3b82f6] w-4 h-4"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
              />
              <span className="text-sm text-[#e6edf3]">Uppercase A–Z</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-[#3b82f6] w-4 h-4"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
              />
              <span className="text-sm text-[#e6edf3]">Lowercase a–z</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-[#3b82f6] w-4 h-4"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
              />
              <span className="text-sm text-[#e6edf3]">Numbers 0–9</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-[#3b82f6] w-4 h-4"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
              />
              <span className="text-sm text-[#e6edf3]">Symbols !@#...</span>
            </label>
          </div>
        </div>

        {/* Exclude Ambiguous */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-[#3b82f6] w-4 h-4"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
          />
          <span className="text-sm text-[#8b949e]">
            Exclude ambiguous characters (0, O, I, l, 1)
          </span>
        </label>
      </div>

      {/* Bulk Generate Panel */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#484f58]">
          Bulk Generate
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-[#8b949e]">Count:</label>
          <input
            type="number"
            min={1}
            max={20}
            value={bulkCount}
            onChange={(e) =>
              setBulkCount(Math.max(1, Math.min(20, Number(e.target.value))))
            }
            className="w-20 rounded border border-[#30363d] bg-[#0d1117] px-2 py-1.5 text-sm text-[#e6edf3] focus:border-[#3b82f6] focus:outline-none"
          />
          <button
            onClick={handleGenerateMultiple}
            disabled={noCharsetSelected}
            className="flex items-center gap-2 rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Multiple
          </button>
        </div>

        {bulkPasswords.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {bulkPasswords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 group hover:border-[#3b82f6]/30 transition-colors"
              >
                <span className="font-mono text-sm text-[#e6edf3] select-all break-all flex-1">
                  {pw}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <CopyButton text={pw} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
