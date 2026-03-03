import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonYamlTool from "./JsonYamlTool";

export const metadata: Metadata = {
  title: "JSON ↔ YAML Converter — Free Online Converter",
  description:
    "Convert JSON to YAML and YAML to JSON instantly. Includes real-time validation, error highlighting, and syntax-formatted output.",
  keywords: [
    "json to yaml",
    "yaml to json",
    "json yaml converter",
    "convert yaml to json",
    "online json converter",
  ],
};

export default function JsonYamlPage() {
  return (
    <ToolLayout
      slug="json-yaml"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            JSON vs YAML — When to Use Each
          </h2>
          <p>
            JSON (JavaScript Object Notation) uses braces and quotes, making it
            ideal for APIs and machine-to-machine communication. YAML (YAML
            Ain&apos;t Markup Language) uses indentation and is more
            human-readable, making it a popular choice for configuration files
            like Docker Compose, Kubernetes manifests, and CI/CD pipelines.
          </p>
          <p>
            Both formats represent the same data structures — objects, arrays,
            strings, numbers, booleans, and nulls — and can be converted
            losslessly in most cases. The main practical difference is
            readability: YAML is easier for humans to write and review, while
            JSON is easier for machines to parse reliably.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Key syntax differences
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded border border-[#30363d] bg-[#0d1117] p-3">
              <p className="text-xs font-semibold text-[#f0883e] mb-2">JSON</p>
              <pre className="text-xs text-[#e6edf3] leading-relaxed">{`{
  "host": "localhost",
  "port": 8080,
  "debug": true,
  "tags": ["api", "v2"]
}`}</pre>
            </div>
            <div className="rounded border border-[#30363d] bg-[#0d1117] p-3">
              <p className="text-xs font-semibold text-[#3b82f6] mb-2">YAML</p>
              <pre className="text-xs text-[#e6edf3] leading-relaxed">{`host: localhost
port: 8080
debug: true
tags:
  - api
  - v2`}</pre>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Common use cases
          </h3>
          <ul className="space-y-1.5 text-xs">
            {[
              ["YAML", "Docker Compose, Kubernetes manifests, GitHub Actions, Ansible"],
              ["YAML", "Helm charts, CircleCI, GitLab CI, AWS CloudFormation"],
              ["JSON", "REST API request/response bodies, package.json, tsconfig.json"],
              ["JSON", "OpenAPI / Swagger specs, VS Code settings, Terraform state files"],
            ].map(([fmt, use]) => (
              <li key={use} className="flex gap-2">
                <span className={`shrink-0 font-mono font-semibold ${fmt === "YAML" ? "text-[#3b82f6]" : "text-[#f0883e]"}`}>
                  {fmt}
                </span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs">
            <strong className="text-[#e6edf3]">Note:</strong> YAML is a superset of JSON — any valid JSON is also
            valid YAML. YAML also supports comments (lines starting with{" "}
            <code className="text-[#3b82f6] bg-[#0d2145] px-1 rounded">#</code>
            ), multi-line strings, and anchors/aliases for reusing values,
            none of which JSON supports.
          </p>
        </div>
      }
    >
      <JsonYamlTool />
    </ToolLayout>
  );
}
