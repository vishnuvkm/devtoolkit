import yaml from "js-yaml";

export type IssueSeverity = "error" | "warning" | "info";

export interface ComposeIssue {
  severity: IssueSeverity;
  path: string;
  message: string;
}

export interface ComposeValidationResult {
  valid: boolean;
  serviceCount: number;
  services: string[];
  issues: ComposeIssue[];
}

const VALID_TOP_LEVEL_KEYS = new Set([
  "version", "services", "networks", "volumes", "configs", "secrets", "name",
]);

const VALID_PORT_PATTERN = /^(\d+(-\d+)?:)?\d+(-\d+)?(\/(?:tcp|udp))?$/;

function validatePort(port: unknown, path: string, issues: ComposeIssue[]) {
  if (typeof port === "number") return; // bare number is fine
  if (typeof port === "string") {
    if (!VALID_PORT_PATTERN.test(port.trim())) {
      issues.push({
        severity: "warning",
        path,
        message: `Unusual port format: "${port}". Expected "HOST:CONTAINER" or "PORT".`,
      });
    }
  }
}

function validateService(
  name: string,
  service: Record<string, unknown>,
  allServiceNames: Set<string>,
  issues: ComposeIssue[]
) {
  const base = `services.${name}`;

  // Must have image or build
  if (!service.image && !service.build) {
    issues.push({
      severity: "error",
      path: base,
      message: `Service "${name}" must define either "image" or "build".`,
    });
  }

  // image and build together is valid but worth a note
  if (service.image && service.build) {
    issues.push({
      severity: "info",
      path: `${base}.image`,
      message: `Service "${name}" defines both "image" and "build". The built image will be tagged with "image".`,
    });
  }

  // Validate ports
  if (service.ports !== undefined) {
    if (!Array.isArray(service.ports)) {
      issues.push({ severity: "error", path: `${base}.ports`, message: '"ports" must be a list.' });
    } else {
      service.ports.forEach((p, i) => validatePort(p, `${base}.ports[${i}]`, issues));
    }
  }

  // Validate depends_on
  if (service.depends_on !== undefined) {
    const deps = Array.isArray(service.depends_on)
      ? service.depends_on
      : typeof service.depends_on === "object" && service.depends_on !== null
      ? Object.keys(service.depends_on as object)
      : [];
    deps.forEach((dep) => {
      if (typeof dep === "string" && !allServiceNames.has(dep)) {
        issues.push({
          severity: "error",
          path: `${base}.depends_on`,
          message: `Service "${name}" depends on "${dep}", which is not defined in this file.`,
        });
      }
    });
  }

  // Warn on deprecated restart values
  if (service.restart && !["no", "always", "on-failure", "unless-stopped"].includes(service.restart as string)) {
    issues.push({
      severity: "warning",
      path: `${base}.restart`,
      message: `Unknown restart policy "${service.restart}". Expected: no, always, on-failure, unless-stopped.`,
    });
  }

  // environment as list: warn on missing = sign
  if (Array.isArray(service.environment)) {
    (service.environment as string[]).forEach((entry, i) => {
      if (typeof entry === "string" && !entry.includes("=") && !entry.includes(":")) {
        issues.push({
          severity: "info",
          path: `${base}.environment[${i}]`,
          message: `"${entry}" has no value — it will be passed through from the host environment.`,
        });
      }
    });
  }

  // volumes as list: basic format check
  if (Array.isArray(service.volumes)) {
    (service.volumes as unknown[]).forEach((v, i) => {
      if (typeof v === "string" && v.startsWith("/") && !v.includes(":")) {
        issues.push({
          severity: "warning",
          path: `${base}.volumes[${i}]`,
          message: `"${v}" looks like a host path without a container mount point.`,
        });
      }
    });
  }
}

export function validateDockerCompose(
  input: string
): { result: ComposeValidationResult | null; parseError: string | null } {
  if (!input.trim()) {
    return { result: null, parseError: null };
  }

  let parsed: unknown;
  try {
    parsed = yaml.load(input);
  } catch (e) {
    return {
      result: null,
      parseError: e instanceof Error ? e.message : "YAML parse error",
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { result: null, parseError: "Docker Compose file must be a YAML mapping (object) at the top level." };
  }

  const doc = parsed as Record<string, unknown>;
  const issues: ComposeIssue[] = [];

  // Check for unknown top-level keys
  Object.keys(doc).forEach((key) => {
    if (!VALID_TOP_LEVEL_KEYS.has(key)) {
      issues.push({
        severity: "warning",
        path: key,
        message: `Unknown top-level key "${key}". Valid keys: ${[...VALID_TOP_LEVEL_KEYS].join(", ")}.`,
      });
    }
  });

  // Warn on version (deprecated in Compose v2+)
  if (doc.version !== undefined) {
    issues.push({
      severity: "info",
      path: "version",
      message: `The "version" field is ignored by Compose v2+ (Docker Desktop 4.1+). You can safely remove it.`,
    });
  }

  // services is required
  if (!doc.services) {
    issues.push({ severity: "error", path: "services", message: 'No "services" key found. A Compose file must define at least one service.' });
    return {
      result: { valid: false, serviceCount: 0, services: [], issues },
      parseError: null,
    };
  }

  if (typeof doc.services !== "object" || Array.isArray(doc.services)) {
    issues.push({ severity: "error", path: "services", message: '"services" must be a mapping of service name → service definition.' });
    return { result: { valid: false, serviceCount: 0, services: [], issues }, parseError: null };
  }

  const servicesMap = doc.services as Record<string, unknown>;
  const serviceNames = Object.keys(servicesMap);
  const allServiceNames = new Set(serviceNames);

  serviceNames.forEach((name) => {
    const svc = servicesMap[name];
    if (typeof svc !== "object" || svc === null || Array.isArray(svc)) {
      issues.push({ severity: "error", path: `services.${name}`, message: `Service "${name}" must be a mapping, not ${Array.isArray(svc) ? "a list" : typeof svc}.` });
      return;
    }
    validateService(name, svc as Record<string, unknown>, allServiceNames, issues);
  });

  const errors = issues.filter((i) => i.severity === "error");
  return {
    result: {
      valid: errors.length === 0,
      serviceCount: serviceNames.length,
      services: serviceNames,
      issues,
    },
    parseError: null,
  };
}
