import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CaseConverterTool from "./CaseConverterTool";

export const metadata: Metadata = {
  title: "Case Converter — Free Online Tool | DevTools Kit",
  description:
    "Convert text between UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case, and more. Free, instant, browser-based.",
};

export default function CaseConverterPage() {
  return (
    <ToolLayout slug="case-converter">
      <CaseConverterTool />
    </ToolLayout>
  );
}
