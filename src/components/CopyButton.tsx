"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({
  text,
  className = "",
  label,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-all ${
        copied
          ? "bg-[#1a3a2a] text-[#3fb950] border border-[#3fb950]/30"
          : "bg-[#1c2128] text-[#8b949e] border border-[#30363d] hover:bg-[#252b33] hover:text-[#e6edf3]"
      } ${className}`}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {label ? (copied ? "Copied!" : label) : copied ? "Copied!" : "Copy"}
    </button>
  );
}
