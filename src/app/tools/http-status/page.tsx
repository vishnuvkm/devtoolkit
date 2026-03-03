import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HttpStatusTool from "./HttpStatusTool";

export const metadata: Metadata = {
  title: "HTTP Status Code Reference — Complete Guide",
  description:
    "Interactive HTTP status code reference with explanations and practical notes for all 1xx, 2xx, 3xx, 4xx, and 5xx codes. Searchable and filterable. Free, client-side tool.",
  keywords: [
    "http status codes",
    "http 404",
    "http 500",
    "http error codes",
    "rest api status codes",
    "http response codes",
    "status code reference",
  ],
};

export default function HttpStatusPage() {
  return (
    <ToolLayout
      slug="http-status"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            HTTP Status Code Classes
          </h2>
          <p>
            HTTP status codes are 3-digit integers grouped into five classes.
            The first digit defines the class; the last two digits provide more
            detail about the specific response.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#30363d] rounded">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117]">
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Class</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Category</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                <tr>
                  <td className="px-3 py-2 font-mono text-[#79c0ff] font-bold">1xx</td>
                  <td className="px-3 py-2 text-[#e6edf3]">Informational</td>
                  <td className="px-3 py-2">Request received, continuing process</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#3fb950] font-bold">2xx</td>
                  <td className="px-3 py-2 text-[#e6edf3]">Success</td>
                  <td className="px-3 py-2">Request was received, understood, and accepted</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#d2a8ff] font-bold">3xx</td>
                  <td className="px-3 py-2 text-[#e6edf3]">Redirection</td>
                  <td className="px-3 py-2">Further action needed to complete the request</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#ffa657] font-bold">4xx</td>
                  <td className="px-3 py-2 text-[#e6edf3]">Client Error</td>
                  <td className="px-3 py-2">Request contains bad syntax or cannot be fulfilled</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#f85149] font-bold">5xx</td>
                  <td className="px-3 py-2 text-[#e6edf3]">Server Error</td>
                  <td className="px-3 py-2">Server failed to fulfil an apparently valid request</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Common Pitfalls
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-[#e6edf3]">401 vs 403</strong> — 401
              means unauthenticated (no credentials), 403 means unauthorized
              (credentials present but insufficient).
            </li>
            <li>
              <strong className="text-[#e6edf3]">301 vs 308</strong> — 301 may
              allow browsers to change POST to GET; 308 guarantees the original
              method is preserved.
            </li>
            <li>
              <strong className="text-[#e6edf3]">502 vs 503</strong> — 502 Bad
              Gateway means an upstream server returned garbage; 503 Service
              Unavailable means the server itself is overloaded or in
              maintenance.
            </li>
          </ul>
        </div>
      }
    >
      <HttpStatusTool />
    </ToolLayout>
  );
}
