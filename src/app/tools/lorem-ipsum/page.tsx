import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LoremIpsumTool from "./LoremIpsumTool";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Free Online Tool | DevTools Kit",
  description:
    "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or word count. Output as plain text, HTML, or Markdown. Free, instant, browser-based.",
};

export default function LoremIpsumPage() {
  return (
    <ToolLayout slug="lorem-ipsum">
      <LoremIpsumTool />
    </ToolLayout>
  );
}
