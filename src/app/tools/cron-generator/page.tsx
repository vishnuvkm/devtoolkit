import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CronGeneratorTool from "./CronGeneratorTool";

export const metadata: Metadata = {
  title: "Cron Expression Generator — Free Online Cron Builder",
  description:
    "Build and validate cron expressions with an interactive editor. Get human-readable descriptions, see next 5 execution times, and use presets for common schedules.",
  keywords: [
    "cron expression generator",
    "cron builder",
    "cron syntax",
    "crontab generator",
    "online cron editor",
  ],
};

export default function CronGeneratorPage() {
  return (
    <ToolLayout
      slug="cron-generator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What is a cron expression?
          </h2>
          <p>
            A cron expression is a string of five fields that defines a
            recurring schedule. Fields are, left to right:{" "}
            <strong className="text-[#e6edf3]">minute</strong>,{" "}
            <strong className="text-[#e6edf3]">hour</strong>,{" "}
            <strong className="text-[#e6edf3]">day of month</strong>,{" "}
            <strong className="text-[#e6edf3]">month</strong>, and{" "}
            <strong className="text-[#e6edf3]">day of week</strong>. The{" "}
            <code className="text-[#3b82f6] bg-[#0d2145] px-1 rounded text-xs">
              *
            </code>{" "}
            wildcard means &quot;every&quot;, so{" "}
            <code className="text-[#3b82f6] bg-[#0d2145] px-1 rounded text-xs">
              * * * * *
            </code>{" "}
            runs every minute.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Common cron patterns
          </h3>
          <ul className="space-y-1 font-mono text-xs">
            {[
              ["0 * * * *", "Every hour"],
              ["0 0 * * *", "Every day at midnight"],
              ["0 9 * * 1-5", "Weekdays at 9am"],
              ["0 0 1 * *", "First day of every month"],
              ["*/15 * * * *", "Every 15 minutes"],
            ].map(([expr, desc]) => (
              <li key={expr} className="flex gap-3">
                <span className="text-[#3b82f6] w-36 shrink-0">{expr}</span>
                <span className="text-[#8b949e]">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <CronGeneratorTool />
    </ToolLayout>
  );
}
