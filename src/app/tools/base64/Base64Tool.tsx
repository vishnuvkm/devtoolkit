"use client";

import { useState, useRef, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { Upload, AlertCircle, ArrowLeftRight } from "lucide-react";

type Mode = "encode" | "decode";

function toBase64(text: string, urlSafe: boolean): string {
  const encoded = btoa(unescape(encodeURIComponent(text)));
  return urlSafe
    ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    : encoded;
}

function fromBase64(b64: string): string {
  // Restore standard Base64 from URL-safe
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    // Binary fallback (non-UTF-8)
    return atob(padded);
  }
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("Hello, World!");
  const [urlSafe, setUrlSafe] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [computedOutput, computedError] = useMemo<[string, string | null]>(() => {
    if (!input.trim()) return ["", null];
    try {
      return [
        mode === "encode" ? toBase64(input, urlSafe) : fromBase64(input),
        null,
      ];
    } catch (e) {
      return [
        "",
        e instanceof Error ? e.message : "Invalid Base64 input",
      ];
    }
  }, [input, mode, urlSafe]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:...;base64,<actual>
      const b64 = result.split(",")[1];
      if (mode === "encode") {
        setInput(b64);
      } else {
        setInput(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const swap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(computedOutput);
  };

  return (
    <div className="space-y-5">
      {/* Mode toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-[#30363d] bg-[#0d1117] p-0.5">
          <button
            onClick={() => setMode("encode")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "encode"
                ? "bg-[#3b82f6] text-white"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "decode"
                ? "bg-[#3b82f6] text-white"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            Decode
          </button>
        </div>

        {mode === "encode" && (
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-3 w-3 rounded accent-[#3b82f6]"
            />
            <span className="text-xs text-[#8b949e]">URL-safe</span>
          </label>
        )}

        <button
          onClick={swap}
          disabled={!computedOutput}
          className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#1c2128] px-2.5 py-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] disabled:opacity-40 transition-colors"
        >
          <ArrowLeftRight className="h-3 w-3" />
          Swap
        </button>

        <label className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#1c2128] px-2.5 py-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] cursor-pointer transition-colors">
          <Upload className="h-3 w-3" />
          Load file
          <input
            type="file"
            ref={fileRef}
            onChange={handleFile}
            className="sr-only"
          />
        </label>
      </div>

      {/* I/O panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
              {mode === "encode" ? "Plain Text" : "Base64"}
            </label>
            <button
              onClick={() => setInput("")}
              className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            spellCheck={false}
            className={`w-full rounded border font-mono text-xs leading-relaxed px-3 py-2.5 placeholder-[#484f58] focus:outline-none resize-none transition-colors ${
              computedError
                ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
                : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
            }`}
            placeholder={
              mode === "encode"
                ? "Enter text to encode…"
                : "Enter Base64 to decode…"
            }
          />
          {computedError && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#f85149]">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {computedError}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
              {mode === "encode" ? "Base64" : "Plain Text"}
            </label>
            {computedOutput && <CopyButton text={computedOutput} />}
          </div>
          <textarea
            value={computedOutput}
            readOnly
            rows={12}
            spellCheck={false}
            className="w-full rounded border border-[#30363d] bg-[#0d1117] font-mono text-xs leading-relaxed px-3 py-2.5 text-[#e6edf3] focus:outline-none resize-none"
            placeholder="Output appears here…"
          />
          {computedOutput && (
            <p className="mt-1 text-[10px] text-[#484f58]">
              {mode === "encode"
                ? `${input.length} chars → ${computedOutput.length} chars`
                : `${input.length} Base64 chars → ${computedOutput.length} chars`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
