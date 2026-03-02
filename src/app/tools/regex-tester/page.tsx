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
            programming language and are invaluable for parsing, validation, and
            text processing.
          </p>
          <p>
            Use the flags: <code className="text-[#3b82f6]">g</code> (global —
            find all matches), <code className="text-[#3b82f6]">i</code>{" "}
            (case-insensitive), <code className="text-[#3b82f6]">m</code>{" "}
            (multiline — ^ and $ match line boundaries).
          </p>
        </div>
      }
    >
      <RegexTesterTool />
    </ToolLayout>
  );
}
