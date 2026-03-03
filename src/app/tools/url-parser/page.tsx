import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UrlParserTool from "./UrlParserTool";

export const metadata: Metadata = {
  title: "URL Parser & Encoder — Parse and Encode URLs Online",
  description:
    "Parse any URL into its components (protocol, host, path, query params, fragment). URL-encode or decode strings instantly. Free, client-side URL tool.",
  keywords: [
    "url parser",
    "url encoder",
    "url decoder",
    "parse url online",
    "url encoder decoder",
    "query string parser",
    "percent encode",
  ],
};

export default function UrlParserPage() {
  return (
    <ToolLayout
      slug="url-parser"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            URL Structure
          </h2>
          <p>
            A URL (Uniform Resource Locator) consists of several components. For
            example:{" "}
            <code className="text-[#e6edf3] break-all">
              https://api.example.com:8080/v1/search?q=hello&page=2#results
            </code>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong className="text-[#e6edf3]">Protocol</strong> —{" "}
              <code>https:</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Hostname</strong> —{" "}
              <code>api.example.com</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Port</strong> —{" "}
              <code>8080</code> (omitted if default for protocol)
            </li>
            <li>
              <strong className="text-[#e6edf3]">Path</strong> —{" "}
              <code>/v1/search</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Query string</strong> —{" "}
              <code>q=hello&amp;page=2</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Fragment</strong> —{" "}
              <code>#results</code> (client-side only, not sent to server)
            </li>
          </ul>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            URL Encoding
          </h3>
          <p>
            URL encoding (percent-encoding) replaces unsafe characters with a{" "}
            <code className="text-[#e6edf3]">%</code> followed by their hex
            code. For example, a space becomes <code className="text-[#e6edf3]">%20</code> and{" "}
            <code className="text-[#e6edf3]">&</code> becomes{" "}
            <code className="text-[#e6edf3]">%26</code>.
          </p>
        </div>
      }
    >
      <UrlParserTool />
    </ToolLayout>
  );
}
