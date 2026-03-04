"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, QrCode } from "lucide-react";
import {
  generateQrDataUrl,
  generateQrSvgString,
  isValidQrInput,
  getCharCount,
  MAX_QR_CHARS,
  ERROR_CORRECTION_LABELS,
  ErrorCorrectionLevel,
  QrOptions,
} from "@/lib/qr-utils";

const SIZE_OPTIONS = [128, 192, 256, 320, 384, 512];
const EC_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

export default function QrCodeGeneratorTool() {
  const [text, setText] = useState("https://devtoolkit.dev");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!isValidQrInput(text)) {
      setDataUrl(null);
      setSvgString(null);
      setError(text.trim().length === 0 ? null : `Too long — max ${MAX_QR_CHARS} characters`);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const opts: QrOptions = { errorCorrectionLevel: ecLevel, size };
      const [png, svg] = await Promise.all([
        generateQrDataUrl(text, opts),
        generateQrSvgString(text, opts),
      ]);
      setDataUrl(png);
      setSvgString(svg);
    } catch (e) {
      setError("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  }, [text, ecLevel, size]);

  useEffect(() => {
    const timer = setTimeout(generate, 300);
    return () => clearTimeout(timer);
  }, [generate]);

  function downloadPng() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  function downloadSvg() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  const charCount = getCharCount(text);
  const valid = isValidQrInput(text);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-[#e6edf3]">
            Text or URL
          </label>
          <span className={`text-xs ${charCount > MAX_QR_CHARS ? "text-red-400" : "text-[#8b949e]"}`}>
            {charCount} / {MAX_QR_CHARS}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Enter a URL, text, email, phone number..."
          className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Size */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
            Size: {size}x{size}px
          </label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  size === s
                    ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                    : "border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Error Correction */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
            Error Correction
          </label>
          <div className="flex flex-wrap gap-2">
            {EC_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setEcLevel(level)}
                title={ERROR_CORRECTION_LABELS[level]}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  ecLevel === level
                    ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                    : "border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[#484f58]">
            {ERROR_CORRECTION_LABELS[ecLevel]}
          </p>
        </div>
      </div>

      {/* QR Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-[#30363d] bg-white p-4 shadow-md">
          {generating ? (
            <div className="flex h-64 w-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#30363d] border-t-[#3b82f6]" />
            </div>
          ) : dataUrl ? (
            <img
              src={dataUrl}
              alt="QR Code"
              width={size}
              height={size}
              className="block"
              style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }}
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center text-[#8b949e]">
              <QrCode className="h-16 w-16 opacity-20" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Download Buttons */}
        {dataUrl && (
          <div className="flex gap-3">
            <button
              onClick={downloadPng}
              className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6]"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
            <button
              onClick={downloadSvg}
              className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6]"
            >
              <Download className="h-4 w-4" />
              Download SVG
            </button>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#484f58]">
          Tips
        </h3>
        <ul className="space-y-1 text-xs text-[#8b949e]">
          <li>• Use <span className="text-[#e6edf3]">H (High)</span> error correction if you will print over part of the QR code (logo, etc.)</li>
          <li>• Use <span className="text-[#e6edf3]">L (Low)</span> for digital displays where the full code will always be visible</li>
          <li>• QR codes work best when printed at least 2x2 cm</li>
          <li>• All generation happens in your browser — your data never leaves your device</li>
        </ul>
      </div>
    </div>
  );
}
