import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UuidGeneratorTool from "./UuidGeneratorTool";

export const metadata: Metadata = {
  title: "UUID Generator — Generate v4 UUIDs Online",
  description:
    "Generate UUID v4 values instantly. Bulk generation up to 100 UUIDs. Copy individually or all at once. Fast, free, client-side UUID generator.",
  keywords: [
    "uuid generator",
    "uuid v4 generator",
    "random uuid",
    "guid generator",
    "generate uuid online",
    "unique id generator",
  ],
};

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      slug="uuid-generator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What is a UUID?
          </h2>
          <p>
            A UUID (Universally Unique Identifier) is a 128-bit label used to
            uniquely identify objects in computer systems. They are written as
            32 hexadecimal digits in 5 groups separated by hyphens:{" "}
            <code className="text-[#e6edf3]">
              xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </code>
            .
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">UUID v4</h3>
          <p>
            Version 4 UUIDs are randomly generated. With 2<sup>122</sup>{" "}
            possible values (≈ 5.3 × 10<sup>36</sup>), the probability of
            collision is practically zero. They are the most commonly used
            version for database primary keys, session IDs, and correlation IDs.
          </p>
          <p>
            All UUIDs are generated using{" "}
            <code className="text-[#e6edf3]">crypto.randomUUID()</code> — the
            browser&apos;s cryptographically secure random number generator. No
            data leaves your browser.
          </p>
        </div>
      }
    >
      <UuidGeneratorTool />
    </ToolLayout>
  );
}
