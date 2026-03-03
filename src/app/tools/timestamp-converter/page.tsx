import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TimestampConverterTool from "./TimestampConverterTool";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch to Date & Date to Epoch",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Shows relative time, multiple timezone outputs, and the current epoch. Free, instant, client-side tool.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "epoch to date",
    "timestamp to date",
    "unix time",
    "epoch time converter",
    "date to unix timestamp",
  ],
};

export default function TimestampConverterPage() {
  return (
    <ToolLayout
      slug="timestamp-converter"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What is a Unix Timestamp?
          </h2>
          <p>
            A Unix timestamp (also called epoch time) is the number of seconds
            that have elapsed since{" "}
            <strong className="text-[#e6edf3]">
              January 1, 1970, 00:00:00 UTC
            </strong>{" "}
            (the Unix epoch). It&apos;s a timezone-independent way to represent
            a specific moment in time.
          </p>
          <p>
            Millisecond timestamps (used in JavaScript with{" "}
            <code className="text-[#e6edf3]">Date.now()</code>) are 1000× larger
            than second timestamps. For example, the second timestamp{" "}
            <code className="text-[#e6edf3]">1700000000</code> is the same moment as
            the millisecond timestamp{" "}
            <code className="text-[#e6edf3]">1700000000000</code>.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Common uses
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Database timestamps (created_at, updated_at)</li>
            <li>JWT expiry claims (exp, iat, nbf)</li>
            <li>Log file analysis</li>
            <li>API rate limiting windows</li>
            <li>Scheduling and cron job debugging</li>
          </ul>
        </div>
      }
    >
      <TimestampConverterTool />
    </ToolLayout>
  );
}
