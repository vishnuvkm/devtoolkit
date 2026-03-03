import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DockerComposeTool from "./DockerComposeTool";

export const metadata: Metadata = {
  title: "Docker Compose Validator — Validate Compose YAML Online",
  description:
    "Paste a Docker Compose file to validate its structure — services, ports, depends_on references, restart policies, volumes, and more. Free, instant, client-side validation.",
  keywords: [
    "docker compose validator",
    "docker-compose yaml validator",
    "validate docker compose",
    "docker compose linter",
    "compose file checker",
    "docker compose syntax",
  ],
};

export default function DockerComposePage() {
  return (
    <ToolLayout
      slug="docker-compose-validator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What This Validator Checks
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-[#e6edf3]">YAML syntax</strong> — catches
              malformed YAML before anything else
            </li>
            <li>
              <strong className="text-[#e6edf3]">Top-level keys</strong> — warns
              on unknown keys outside{" "}
              <code>services</code>, <code>networks</code>,{" "}
              <code>volumes</code>, <code>configs</code>, <code>secrets</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Services required</strong> —
              every Compose file must have at least one service
            </li>
            <li>
              <strong className="text-[#e6edf3]">Image or build</strong> — each
              service must define either <code>image</code> or <code>build</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Port format</strong> — validates{" "}
              <code>HOST:CONTAINER</code> and bare port syntax
            </li>
            <li>
              <strong className="text-[#e6edf3]">depends_on references</strong>{" "}
              — ensures referenced services are defined in the same file
            </li>
            <li>
              <strong className="text-[#e6edf3]">Restart policies</strong> —
              checks for valid values:{" "}
              <code>no</code>, <code>always</code>, <code>on-failure</code>,{" "}
              <code>unless-stopped</code>
            </li>
            <li>
              <strong className="text-[#e6edf3]">Environment variables</strong>{" "}
              — flags passthrough variables (no <code>=</code> value) as info
            </li>
            <li>
              <strong className="text-[#e6edf3]">Volume mounts</strong> — warns
              on host paths without a container mount point
            </li>
          </ul>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Compose v2 vs v3
          </h3>
          <p>
            The <code>version</code> field is ignored by Docker Compose v2+ (Docker
            Desktop 4.1+) and can be safely removed. This validator will note its
            presence as an informational message. All modern Compose features work
            without it.
          </p>
        </div>
      }
    >
      <DockerComposeTool />
    </ToolLayout>
  );
}
