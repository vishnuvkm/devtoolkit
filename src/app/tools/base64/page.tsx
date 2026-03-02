import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Base64Tool from "./Base64Tool";

export const metadata: Metadata = {
  title: "Base64 Encode / Decode — Free Online Tool",
  description:
    "Encode text or files to Base64, or decode Base64 strings back to text. Supports standard and URL-safe Base64 variants.",
  keywords: [
    "base64 encode",
    "base64 decode",
    "base64 encoder decoder",
    "online base64",
    "url safe base64",
  ],
};

export default function Base64Page() {
  return (
    <ToolLayout
      slug="base64"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What is Base64?
          </h2>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary
            data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It
            is widely used to encode binary data in contexts that only support
            text — like embedding images in HTML, encoding email attachments, or
            passing binary data in JSON APIs.
          </p>
          <p>
            URL-safe Base64 replaces <code className="text-[#3b82f6]">+</code>{" "}
            with <code className="text-[#3b82f6]">-</code> and{" "}
            <code className="text-[#3b82f6]">/</code> with{" "}
            <code className="text-[#3b82f6]">_</code> to make the output safe
            for use in URLs and filenames.
          </p>
        </div>
      }
    >
      <Base64Tool />
    </ToolLayout>
  );
}
