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
            JSON vs YAML
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
            losslessly in most cases.
          </p>
        </div>
      }
    >
      <JsonYamlTool />
    </ToolLayout>
  );
}
