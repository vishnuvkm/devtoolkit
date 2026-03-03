import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RegexTesterTool from "./RegexTesterTool";

export const metadata: Metadata = {
  title: "Regex Tester — Test Regular Expressions Online",
  description:
    "Test regular expressions in real time. Highlight matches, view capture groups, and reference a built-in regex cheat sheet.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex online",
    "regex validator",
    "regex match tester",
  ],
};

export default function RegexTesterPage() {
  return (
    <ToolLayout
      slug="regex-tester"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            Regular Expression Basics
          </h2>
          <p>
            Regular expressions (regex) are patterns used to match character
            combinations in strings. They are supported in virtually every
            programming language and are invaluable for input validation, log
            parsing, search-and-replace, and data extraction.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">Flags</h3>
          <ul className="space-y-1 text-xs">
            {[
              ["g", "Global — find all matches, not just the first"],
              ["i", "Case-insensitive — match A and a equally"],
              ["m", "Multiline — ^ and $ match start/end of each line"],
              ["s", "Dotall — . matches newlines too"],
            ].map(([flag, desc]) => (
              <li key={flag} className="flex gap-2">
                <code className="text-[#3b82f6] bg-[#0d2145] px-1.5 rounded shrink-0 font-mono">
                  {flag}
                </code>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Practical patterns
          </h3>
          <ul className="space-y-1.5 text-xs">
            {[
              ["^\\d{4}-\\d{2}-\\d{2}$", "ISO date (YYYY-MM-DD)"],
              ["[\\w.+-]+@[\\w-]+\\.[\\w.]+", "Email address"],
              ["https?:\\/\\/[^\\s]+", "HTTP/HTTPS URL"],
              ["\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", "IPv4 address"],
              ["#[0-9a-fA-F]{3,6}\\b", "CSS hex color"],
            ].map(([pattern, desc]) => (
              <li key={pattern} className="flex flex-wrap gap-x-3 gap-y-0.5">
                <code className="text-[#3b82f6] font-mono shrink-0">
                  {pattern}
                </code>
                <span className="text-[#484f58]">{desc}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs">
            <strong className="text-[#e6edf3]">Tip:</strong> Wrap patterns in{" "}
            <code className="text-[#3b82f6] bg-[#0d2145] px-1 rounded">
              ( )
            </code>{" "}
            to create capture groups — the matched text inside each group is
            shown in the match list. Use{" "}
            <code className="text-[#3b82f6] bg-[#0d2145] px-1 rounded">
              (?:)
            </code>{" "}
            for grouping without capturing.
          </p>
        </div>
      }
    >
      <RegexTesterTool />
    </ToolLayout>
  );
}
