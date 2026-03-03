"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { ArrowLeftRight, AlertCircle } from "lucide-react";
import { jsonToYaml, yamlToJson } from "@/lib/json-yaml-utils";

type Direction = "json-to-yaml" | "yaml-to-json";

const SAMPLE_JSON = `{
  "name": "my-service",
  "version": "1.0.0",
  "config": {
    "port": 8080,
    "debug": true,
    "allowedHosts": ["localhost", "example.com"]
  }
}`;

const SAMPLE_YAML = `name: my-service
version: 1.0.0
config:
  port: 8080
  debug: true
  allowedHosts:
    - localhost
    - example.com`;

export default function JsonYamlTool() {
  const [direction, setDirection] = useState<Direction>("json-to-yaml");
  const [input, setInput] = useState(SAMPLE_JSON);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    return direction === "json-to-yaml" ? jsonToYaml(input) : yamlToJson(input);
  }, [input, direction]);

  const swap = () => {
    const newDir: Direction =
      direction === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    const newInput = output || (newDir === "json-to-yaml" ? SAMPLE_JSON : SAMPLE_YAML);
    setDirection(newDir);
    setInput(newInput);
  };

  const directionLabel =
    direction === "json-to-yaml"
      ? { from: "JSON", to: "YAML" }
      : { from: "YAML", to: "JSON" };

  return (
    <div className="space-y-4">
      {/* Direction toggle */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-[#30363d] bg-[#0d1117] p-0.5">
          <button
            onClick={() => {
              setDirection("json-to-yaml");
              setInput(SAMPLE_JSON);
            }}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              direction === "json-to-yaml"
                ? "bg-[#3b82f6] text-white"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            JSON → YAML
          </button>
          <button
            onClick={() => {
              setDirection("yaml-to-json");
              setInput(SAMPLE_YAML);
            }}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              direction === "yaml-to-json"
                ? "bg-[#3b82f6] text-white"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            YAML → JSON
          </button>
        </div>
        <button
          onClick={swap}
          title="Swap — use output as input"
          className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#1c2128] px-2.5 py-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
        >
          <ArrowLeftRight className="h-3 w-3" />
          Swap
        </button>
      </div>

      {/* Input / Output panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
              Input ({directionLabel.from})
            </label>
            <button
              onClick={() => setInput("")}
              className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            spellCheck={false}
            className={`w-full rounded border font-mono text-xs leading-relaxed px-3 py-2.5 text-[#e6edf3] placeholder-[#484f58] focus:outline-none resize-none transition-colors ${
              error
                ? "border-[#f85149]/50 bg-[#2a0d0d]"
                : "border-[#30363d] bg-[#0d1117] focus:border-[#3b82f6]"
            }`}
            placeholder={`Paste ${directionLabel.from} here…`}
          />
          {error && (
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[#f85149]">
              <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
              <span className="font-mono">{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
              Output ({directionLabel.to})
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            rows={16}
            spellCheck={false}
            className="w-full rounded border border-[#30363d] bg-[#0d1117] font-mono text-xs leading-relaxed px-3 py-2.5 text-[#e6edf3] focus:outline-none resize-none"
            placeholder={`${directionLabel.to} output appears here…`}
          />
        </div>
      </div>
    </div>
  );
}
