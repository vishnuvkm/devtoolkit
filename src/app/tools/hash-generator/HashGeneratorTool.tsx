"use client";

import { useState, useEffect, useRef } from "react";
import CopyButton from "@/components/CopyButton";
import { Upload, FileText } from "lucide-react";
import { computeHashes, type HashResult } from "@/lib/hash";

const SAMPLE_TEXT = "Hello, DevTools Kit!";

const ALGORITHMS = [
  { key: "md5" as const, label: "MD5", length: 32 },
  { key: "sha1" as const, label: "SHA-1", length: 40 },
  { key: "sha256" as const, label: "SHA-256", length: 64 },
  { key: "sha512" as const, label: "SHA-512", length: 128 },
];

export default function HashGeneratorTool() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState(SAMPLE_TEXT);
  const [fileName, setFileName] = useState<string | null>(null);
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== "text") return;
    if (!text) { setHashes(null); return; }
    setLoading(true);
    const data = new TextEncoder().encode(text);
    computeHashes(data).then((h) => { setHashes(h); setLoading(false); });
  }, [text, mode]);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buf = e.target?.result as ArrayBuffer;
      const h = await computeHashes(new Uint8Array(buf));
      setHashes(h);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded border border-[#30363d] overflow-hidden w-fit">
        {(["text", "file"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setHashes(null); setFileName(null); }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-[#1e3a5f] text-[#3b82f6]"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            {m === "text" ? "Text Input" : "File Upload"}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === "text" ? (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
              Input Text
            </label>
            <button
              onClick={() => setText("")}
              className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#3b82f6] resize-none transition-colors"
            placeholder="Enter text to hash…"
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded border-2 border-dashed border-[#30363d] bg-[#0d1117] px-6 py-10 text-center transition-colors hover:border-[#3b82f6]/50 hover:bg-[#0d1117]"
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-[#3b82f6]" />
              <span className="text-sm font-medium text-[#e6edf3]">{fileName}</span>
              <span className="text-xs text-[#484f58]">Click to change file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-[#484f58]" />
              <span className="text-sm text-[#8b949e]">Drop a file or click to browse</span>
              <span className="text-xs text-[#484f58]">Any file type supported</span>
            </div>
          )}
        </div>
      )}

      {/* Hash outputs */}
      <div className="space-y-3">
        {ALGORITHMS.map(({ key, label, length }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
                {label}
              </span>
              {hashes?.[key] && <CopyButton text={hashes[key]} />}
            </div>
            <div className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 font-mono text-xs text-[#e6edf3] break-all min-h-[38px]">
              {loading ? (
                <span className="text-[#484f58]">Computing…</span>
              ) : hashes?.[key] ? (
                hashes[key]
              ) : (
                <span className="text-[#484f58]">
                  {"—".repeat(Math.min(length / 2, 20))} ({length} hex chars)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
