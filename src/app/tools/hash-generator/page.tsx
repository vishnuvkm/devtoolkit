import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HashGeneratorTool from "./HashGeneratorTool";

export const metadata: Metadata = {
  title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Online",
  description:
    "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files instantly. Free, client-side hash calculator — no data leaves your browser.",
  keywords: [
    "hash generator",
    "sha256 generator",
    "md5 hash generator",
    "sha512 hash",
    "sha1 generator",
    "checksum calculator",
    "file hash online",
  ],
};

export default function HashGeneratorPage() {
  return (
    <ToolLayout
      slug="hash-generator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            About Cryptographic Hash Functions
          </h2>
          <p>
            A hash function takes input data and produces a fixed-size digest.
            The same input always produces the same hash, but even a tiny change
            to the input produces a completely different hash — this is called
            the{" "}
            <strong className="text-[#e6edf3]">avalanche effect</strong>.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            When to use each algorithm
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong className="text-[#e6edf3]">MD5</strong> — Legacy
              checksums, file integrity checks (not for passwords or security)
            </li>
            <li>
              <strong className="text-[#e6edf3]">SHA-1</strong> — Legacy Git
              commits, older certificates (deprecated for security use)
            </li>
            <li>
              <strong className="text-[#e6edf3]">SHA-256</strong> — Preferred
              for security: TLS, code signing, API signatures
            </li>
            <li>
              <strong className="text-[#e6edf3]">SHA-512</strong> — Higher
              security margin, used in some password hashing schemes
            </li>
          </ul>
          <p className="text-xs text-[#484f58]">
            All hashing runs entirely in your browser using the Web Crypto API
            — no data is sent to any server.
          </p>
        </div>
      }
    >
      <HashGeneratorTool />
    </ToolLayout>
  );
}
