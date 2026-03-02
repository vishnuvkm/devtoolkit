"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function base64UrlDecode(str: string): string {
  // Pad to multiple of 4
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (Math.abs(diff) < 60) return `${Math.abs(diff)}s ago`;
  if (Math.abs(diff) < 3600)
    return `${Math.floor(Math.abs(diff) / 60)}m ago`;
  if (Math.abs(diff) < 86400)
    return `${Math.floor(Math.abs(diff) / 3600)}h ago`;
  return `${Math.floor(Math.abs(diff) / 86400)}d ago`;
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState(SAMPLE_JWT);

  const decoded = useMemo<{
    result: DecodedJwt | null;
    error: string | null;
  }>(() => {
    if (!token.trim()) return { result: null, error: null };
    const parts = token.trim().split(".");
    if (parts.length !== 3)
      return { result: null, error: "Invalid JWT: must have 3 parts (header.payload.signature)" };
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const isExpired =
        "exp" in payload ? Date.now() / 1000 > (payload.exp as number) : null;
      return {
        result: { header, payload, signature: parts[2], isExpired },
        error: null,
      };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : "Failed to decode JWT",
      };
    }
  }, [token]);

  const { result, error } = decoded;

  const renderJson = (obj: Record<string, unknown>) =>
    JSON.stringify(obj, null, 2);

  return (
    <div className="space-y-5">
      {/* Token input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            JWT Token
          </label>
          <button
            onClick={() => setToken("")}
            className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          spellCheck={false}
          className={`w-full rounded border font-mono text-xs leading-relaxed px-3 py-2.5 placeholder-[#484f58] focus:outline-none resize-none transition-colors ${
            error
              ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
              : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
          }`}
          placeholder="Paste your JWT here…"
        />
        {error && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#f85149]">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}
      </div>

      {result && (
        <>
          {/* Status bar */}
          <div
            className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${
              result.isExpired === null
                ? "border-[#30363d] bg-[#1c2128] text-[#8b949e]"
                : result.isExpired
                ? "border-[#f85149]/30 bg-[#2a0d0d] text-[#f85149]"
                : "border-[#3fb950]/30 bg-[#0d2a1a] text-[#3fb950]"
            }`}
          >
            {result.isExpired === null ? (
              <Clock className="h-4 w-4" />
            ) : result.isExpired ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span className="font-medium text-xs">
              {result.isExpired === null
                ? "No expiry claim (exp) found"
                : result.isExpired
                ? "Token is EXPIRED"
                : "Token is VALID (not expired)"}
            </span>
            {typeof result.payload.exp === "number" && (
              <span className="ml-auto text-xs opacity-70">
                exp: {formatDate(result.payload.exp)} (
                {timeAgo(result.payload.exp)})
              </span>
            )}
          </div>

          {/* Three sections */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Header */}
            <Section
              title="Header"
              colorClass="text-[#f0883e]"
              content={renderJson(result.header)}
            />

            {/* Payload */}
            <Section
              title="Payload"
              colorClass="text-[#3b82f6]"
              content={renderJson(result.payload)}
              extra={
                result.payload.iat ? (
                  <p className="mt-1 text-[10px] text-[#484f58]">
                    iat: {formatDate(result.payload.iat as number)}
                  </p>
                ) : null
              }
            />

            {/* Signature */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#3fb950]">
                  Signature
                </span>
                <CopyButton text={result.signature} />
              </div>
              <div className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 font-mono text-[10px] text-[#8b949e] break-all leading-relaxed">
                {result.signature}
              </div>
              <p className="mt-1 text-[10px] text-[#484f58]">
                Signature not verified — needs secret key
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  colorClass,
  content,
  extra,
}: {
  title: string;
  colorClass: string;
  content: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${colorClass}`}>{title}</span>
        <CopyButton text={content} />
      </div>
      <pre className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 font-mono text-xs text-[#e6edf3] overflow-x-auto whitespace-pre-wrap break-words">
        {content}
      </pre>
      {extra}
    </div>
  );
}
