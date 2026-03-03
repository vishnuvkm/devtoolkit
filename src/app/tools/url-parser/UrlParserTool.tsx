"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { AlertCircle } from "lucide-react";
import { parseUrl, encodeUrlComponent, decodeUrlComponent } from "@/lib/url-utils";

const SAMPLE_URL =
  "https://api.example.com:8080/v1/search?q=hello+world&page=2&sort=desc#results";

type Tab = "parse" | "encode";

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 items-start py-2 border-b border-[#21262d] last:border-b-0">
      <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider pt-0.5">
        {label}
      </span>
      <div className="flex items-start gap-2">
        <span className={`flex-1 text-sm text-[#e6edf3] break-all ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function UrlParserTool() {
  const [tab, setTab] = useState<Tab>("parse");

  // Parse tab
  const [urlInput, setUrlInput] = useState(SAMPLE_URL);
  const parsed = useMemo(() => parseUrl(urlInput), [urlInput]);

  // Encode tab
  const [encodeInput, setEncodeInput] = useState("hello world / test & value=1");
  const [encodeMode, setEncodeMode] = useState<"encode" | "decode">("encode");
  const encodeResult = useMemo(() => {
    if (!encodeInput.trim()) return "";
    if (encodeMode === "encode") return encodeUrlComponent(encodeInput);
    const { result, error } = decodeUrlComponent(encodeInput);
    return error ? `Error: ${error}` : result;
  }, [encodeInput, encodeMode]);

  return (
    <div className="space-y-5">
      {/* Tab toggle */}
      <div className="flex rounded border border-[#30363d] overflow-hidden w-fit">
        {(["parse", "encode"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[#1e3a5f] text-[#3b82f6]"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            {t === "parse" ? "Parse URL" : "Encode / Decode"}
          </button>
        ))}
      </div>

      {/* Parse tab */}
      {tab === "parse" && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                URL
              </label>
              <button
                onClick={() => setUrlInput("")}
                className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
              >
                Clear
              </button>
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              spellCheck={false}
              className={`w-full rounded border px-3 py-2.5 font-mono text-sm placeholder-[#484f58] focus:outline-none transition-colors ${
                parsed.error && urlInput
                  ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
                  : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
              }`}
              placeholder="https://example.com/path?key=value"
            />
            {parsed.error && urlInput && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#f85149]">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {parsed.error}
              </p>
            )}
          </div>

          {parsed.result && (
            <div className="rounded border border-[#30363d] bg-[#0d1117] px-4">
              <Field label="Protocol" value={parsed.result.protocol} />
              <Field label="Hostname" value={parsed.result.hostname} />
              {parsed.result.port && (
                <Field label="Port" value={parsed.result.port} />
              )}
              <Field label="Path" value={parsed.result.pathname} />
              {parsed.result.search && (
                <Field label="Query string" value={parsed.result.search} />
              )}
              {parsed.result.hash && (
                <Field label="Fragment" value={parsed.result.hash} />
              )}
              <Field label="Origin" value={parsed.result.origin} />

              {parsed.result.params.length > 0 && (
                <div className="py-2">
                  <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                    Query params ({parsed.result.params.length})
                  </span>
                  <div className="mt-2 rounded border border-[#30363d] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#30363d] bg-[#161b22]">
                          <th className="text-left text-xs font-medium text-[#484f58] px-3 py-2">Key</th>
                          <th className="text-left text-xs font-medium text-[#484f58] px-3 py-2">Value</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.result.params.map(([k, v], i) => (
                          <tr
                            key={i}
                            className={i < parsed.result!.params.length - 1 ? "border-b border-[#21262d]" : ""}
                          >
                            <td className="px-3 py-2 font-mono text-xs text-[#3b82f6]">{k}</td>
                            <td className="px-3 py-2 font-mono text-xs text-[#e6edf3] break-all">{v}</td>
                            <td className="px-3 py-2">
                              <CopyButton text={v} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Encode/Decode tab */}
      {tab === "encode" && (
        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex rounded border border-[#30363d] overflow-hidden w-fit">
            {(["encode", "decode"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setEncodeMode(m)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  encodeMode === m
                    ? "bg-[#1e3a5f] text-[#3b82f6]"
                    : "text-[#8b949e] hover:text-[#e6edf3]"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
              Input
            </label>
            <textarea
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              rows={3}
              className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 font-mono text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#3b82f6] resize-none"
              placeholder={
                encodeMode === "encode"
                  ? "Enter text to encode…"
                  : "Enter encoded string to decode…"
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                Output
              </label>
              {encodeResult && !encodeResult.startsWith("Error") && (
                <CopyButton text={encodeResult} />
              )}
            </div>
            <div
              className={`w-full rounded border px-3 py-2.5 font-mono text-sm min-h-[80px] break-all ${
                encodeResult.startsWith("Error")
                  ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
                  : "border-[#30363d] bg-[#0d1117] text-[#e6edf3]"
              }`}
            >
              {encodeResult || (
                <span className="text-[#484f58]">Output will appear here…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
