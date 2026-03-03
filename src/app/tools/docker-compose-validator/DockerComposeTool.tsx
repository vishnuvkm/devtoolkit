"use client";

import { useState, useMemo } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { validateDockerCompose, type IssueSeverity } from "@/lib/docker-compose-utils";

const SAMPLE = `services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    restart: unless-stopped

  api:
    build: ./api
    image: myapp/api:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL
    volumes:
      - ./data:/app/data
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  db_data:
`;

const SEVERITY_CONFIG: Record<IssueSeverity, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  error: {
    icon: AlertCircle,
    color: "text-[#f85149]",
    bg: "bg-[#2a0d0d]",
    border: "border-[#da3633]",
    label: "Error",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-[#ffa657]",
    bg: "bg-[#2a1a0d]",
    border: "border-[#9e6a03]",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "text-[#79c0ff]",
    bg: "bg-[#0d2137]",
    border: "border-[#1f6feb]",
    label: "Info",
  },
};

export default function DockerComposeTool() {
  const [input, setInput] = useState(SAMPLE);

  const { result, parseError } = useMemo(() => validateDockerCompose(input), [input]);

  const errors = result?.issues.filter((i) => i.severity === "error") ?? [];
  const warnings = result?.issues.filter((i) => i.severity === "warning") ?? [];
  const infos = result?.issues.filter((i) => i.severity === "info") ?? [];

  const isValid = result?.valid === true && !parseError;
  const isEmpty = !input.trim();

  return (
    <div className="space-y-5">
      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[#484f58] uppercase tracking-wider">
            Docker Compose YAML
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="text-xs text-[#484f58] hover:text-[#3b82f6] transition-colors"
            >
              Load example
            </button>
            <button
              onClick={() => setInput("")}
              className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={18}
          spellCheck={false}
          placeholder={`services:\n  web:\n    image: nginx:alpine\n    ports:\n      - "80:80"`}
          className={`w-full rounded border px-3 py-2.5 font-mono text-sm placeholder-[#484f58] focus:outline-none transition-colors resize-y ${
            parseError
              ? "border-[#f85149]/50 bg-[#2a0d0d] text-[#f85149]"
              : "border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#3b82f6]"
          }`}
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="flex items-start gap-2.5 rounded border border-[#da3633] bg-[#2a0d0d] px-4 py-3">
          <AlertCircle className="h-4 w-4 text-[#f85149] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#f85149]">YAML Parse Error</p>
            <p className="text-xs text-[#f85149]/80 mt-0.5 font-mono">{parseError}</p>
          </div>
        </div>
      )}

      {/* Validation results */}
      {result && !isEmpty && (
        <div className="space-y-4">
          {/* Status bar */}
          <div className={`flex items-center gap-3 rounded border px-4 py-3 ${
            isValid
              ? "border-[#238636] bg-[#0d2a1a]"
              : "border-[#da3633] bg-[#2a0d0d]"
          }`}>
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-[#3fb950] shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-[#f85149] shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${isValid ? "text-[#3fb950]" : "text-[#f85149]"}`}>
                {isValid ? "Valid Docker Compose file" : "Validation failed"}
              </p>
              {result.serviceCount > 0 && (
                <p className="text-xs text-[#8b949e] mt-0.5">
                  {result.serviceCount} service{result.serviceCount !== 1 ? "s" : ""} found:{" "}
                  <span className="font-mono text-[#e6edf3]">
                    {result.services.join(", ")}
                  </span>
                </p>
              )}
            </div>
            {/* Issue counts */}
            <div className="flex items-center gap-3 text-xs shrink-0">
              {errors.length > 0 && (
                <span className="flex items-center gap-1 text-[#f85149]">
                  <AlertCircle className="h-3 w-3" />
                  {errors.length}
                </span>
              )}
              {warnings.length > 0 && (
                <span className="flex items-center gap-1 text-[#ffa657]">
                  <AlertTriangle className="h-3 w-3" />
                  {warnings.length}
                </span>
              )}
              {infos.length > 0 && (
                <span className="flex items-center gap-1 text-[#79c0ff]">
                  <Info className="h-3 w-3" />
                  {infos.length}
                </span>
              )}
              {result.issues.length === 0 && (
                <span className="text-[#3fb950]">No issues</span>
              )}
            </div>
          </div>

          {/* Issue list */}
          {result.issues.length > 0 && (
            <div className="space-y-2">
              {(["error", "warning", "info"] as IssueSeverity[]).map((sev) => {
                const issues = result.issues.filter((i) => i.severity === sev);
                if (issues.length === 0) return null;
                const cfg = SEVERITY_CONFIG[sev];
                const Icon = cfg.icon;
                return (
                  <div key={sev}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${cfg.color}`}>
                      {cfg.label}s ({issues.length})
                    </p>
                    <div className={`rounded border ${cfg.border} overflow-hidden`}>
                      {issues.map((issue, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 px-4 py-3 ${cfg.bg} ${
                            i < issues.length - 1 ? "border-b border-[#21262d]" : ""
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${cfg.color} shrink-0 mt-0.5`} />
                          <div className="min-w-0">
                            <code className="text-xs text-[#484f58] font-mono block mb-0.5">
                              {issue.path}
                            </code>
                            <p className={`text-sm ${cfg.color}`}>{issue.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isEmpty && (
        <p className="text-center text-sm text-[#484f58] py-6">
          Paste a Docker Compose file above to validate it.
        </p>
      )}
    </div>
  );
}
