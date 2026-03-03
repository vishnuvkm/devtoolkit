"use client";

import { useState, useMemo, useCallback } from "react";
import CopyButton from "@/components/CopyButton";
import { parseColorInput, rgbToHex, type RGBColor } from "@/lib/color-utils";

const EXAMPLES = ["#3b82f6", "#10b981", "rgb(239, 68, 68)", "hsl(270, 100%, 60%)", "ffa657"];

export default function ColorConverterTool() {
  const [input, setInput] = useState("#3b82f6");

  const parsed = useMemo(() => parseColorInput(input), [input]);

  // Sync picker → text input
  const handlePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const hasInput = input.trim().length > 0;
  const hasError = hasInput && !parsed;

  const hexForPicker = parsed ? parsed.hex : "#3b82f6";

  return (
    <div className="space-y-5">
      {/* Input row */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Color Input
          </label>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="text-xs text-[#484f58] hover:text-[#3b82f6] font-mono transition-colors"
              >
                {ex.startsWith("#") || ex.startsWith("r") || ex.startsWith("h") ? ex : `#${ex}`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Color picker */}
          <label className="relative cursor-pointer shrink-0" title="Pick a color">
            <input
              type="color"
              value={hexForPicker}
              onChange={handlePickerChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-11 h-11 rounded border border-[#30363d] shadow-inner transition-colors"
              style={{ backgroundColor: hexForPicker }}
            />
          </label>
          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="e.g. #3b82f6 or rgb(59,130,246) or hsl(217,91%,60%)"
            className={`flex-1 rounded border px-3 py-2.5 font-mono text-sm placeholder-[#484f58] focus:outline-none transition-colors ${
              hasError
                ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
                : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
            }`}
          />
        </div>
        {hasError && (
          <p className="mt-1.5 text-xs text-[#f85149]">
            Unrecognised format. Try{" "}
            <code>#rrggbb</code>, <code>rgb(r,g,b)</code>, or <code>hsl(h,s%,l%)</code>.
          </p>
        )}
      </div>

      {parsed && (
        <>
          {/* Large preview */}
          <div
            className="w-full h-24 rounded-lg border border-[#30363d] transition-colors duration-150"
            style={{ backgroundColor: parsed.hex }}
            aria-label={`Color preview: ${parsed.hex}`}
          />

          {/* Color values */}
          <div className="rounded border border-[#30363d] bg-[#0d1117] overflow-hidden">
            {[
              { label: "HEX", value: parsed.hex },
              {
                label: "RGB",
                value: `rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`,
              },
              {
                label: "HSL",
                value: `hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)`,
              },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                className={`grid grid-cols-[80px_1fr] gap-3 items-center px-4 py-3 ${
                  i < arr.length - 1 ? "border-b border-[#21262d]" : ""
                }`}
              >
                <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-[#e6edf3] font-mono">{value}</code>
                  <CopyButton text={value} />
                </div>
              </div>
            ))}

            {/* Tailwind */}
            <div className="grid grid-cols-[80px_1fr] gap-3 items-center px-4 py-3 border-t border-[#21262d]">
              <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                Tailwind
              </span>
              {parsed.tailwind ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-[#e6edf3] font-mono">
                    {parsed.tailwind}
                  </code>
                  <CopyButton text={parsed.tailwind} />
                </div>
              ) : (
                <span className="text-sm text-[#484f58]">No near match</span>
              )}
            </div>
          </div>

          {/* RGB channel sliders */}
          <div>
            <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-3">
              RGB Channels
            </p>
            <div className="space-y-3">
              {(["r", "g", "b"] as const).map((ch) => {
                const val = parsed.rgb[ch];
                const labels = { r: "Red", g: "Green", b: "Blue" };
                const gradients = {
                  r: `linear-gradient(to right, rgb(0,${parsed.rgb.g},${parsed.rgb.b}), rgb(255,${parsed.rgb.g},${parsed.rgb.b}))`,
                  g: `linear-gradient(to right, rgb(${parsed.rgb.r},0,${parsed.rgb.b}), rgb(${parsed.rgb.r},255,${parsed.rgb.b}))`,
                  b: `linear-gradient(to right, rgb(${parsed.rgb.r},${parsed.rgb.g},0), rgb(${parsed.rgb.r},${parsed.rgb.g},255))`,
                };
                return (
                  <div key={ch} className="flex items-center gap-3">
                    <span className="text-xs text-[#8b949e] w-10 shrink-0">{labels[ch]}</span>
                    <div className="flex-1 relative h-4 rounded-full overflow-hidden border border-[#30363d]">
                      <div className="absolute inset-0" style={{ background: gradients[ch] }} />
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={val}
                        onChange={(e) => {
                          const newRgb: RGBColor = { ...parsed.rgb, [ch]: Number(e.target.value) };
                          setInput(rgbToHex(newRgb));
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
                        style={{ left: `${(val / 255) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[#e6edf3] w-8 text-right shrink-0">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
