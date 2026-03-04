import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WordCounterTool from "./WordCounterTool";

export const metadata: Metadata = {
  title: "Word Counter — Free Online Word & Character Count Tool | DevTools Kit",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Get reading time estimates and see your most-used words. Free online word counter.",
  keywords: [
    "word counter",
    "character counter",
    "word count tool",
    "character count",
    "reading time calculator",
    "online word counter",
  ],
};

export default function WordCounterPage() {
  return (
    <ToolLayout
      slug="word-counter"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            About the Word Counter
          </h2>
          <p>
            Paste or type any text to instantly see detailed statistics. All
            analysis happens in your browser — your text is never sent to a
            server.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">Reading Time</h3>
              <p>
                Reading time is estimated at 200 words per minute — the average
                adult reading speed for general text. Academic or technical
                content is typically read at 150–180 wpm.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Character Limits
              </h3>
              <p>
                Common limits to keep in mind: Twitter/X posts are 280
                characters, Instagram captions allow 2,200, and SMS messages are
                160 characters per segment.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">Top Words</h3>
              <p>
                The top words panel shows your most-used meaningful words,
                excluding common filler words like &ldquo;the&rdquo;,
                &ldquo;and&rdquo;, and &ldquo;is&rdquo;. Useful for checking
                keyword density in SEO content.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">Unique Words</h3>
              <p>
                The unique word count shows your vocabulary diversity. A higher
                ratio of unique to total words generally indicates richer, more
                varied writing.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <WordCounterTool />
    </ToolLayout>
  );
}
