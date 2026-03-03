import { describe, it, expect } from "vitest";
import { validateDockerCompose } from "../lib/docker-compose-utils";

const MINIMAL_VALID = `
services:
  web:
    image: nginx:alpine
`;

describe("validateDockerCompose", () => {
  it("returns null result for empty input", () => {
    const { result, parseError } = validateDockerCompose("  ");
    expect(result).toBeNull();
    expect(parseError).toBeNull();
  });

  it("returns parse error for invalid YAML", () => {
    const { result, parseError } = validateDockerCompose(":\t: bad:");
    expect(result).toBeNull();
    expect(parseError).not.toBeNull();
  });

  it("returns error if top-level is not an object", () => {
    const { result, parseError } = validateDockerCompose("- item1\n- item2\n");
    expect(parseError).not.toBeNull();
  });

  it("validates minimal valid compose file", () => {
    const { result, parseError } = validateDockerCompose(MINIMAL_VALID);
    expect(parseError).toBeNull();
    expect(result).not.toBeNull();
    expect(result!.valid).toBe(true);
    expect(result!.serviceCount).toBe(1);
    expect(result!.services).toContain("web");
  });

  it("errors when services key is missing", () => {
    const { result } = validateDockerCompose("version: '3'\n");
    expect(result!.valid).toBe(false);
    expect(result!.issues.some((i) => i.severity === "error" && i.path === "services")).toBe(true);
  });

  it("errors when service has no image or build", () => {
    const yaml = `services:\n  web:\n    ports:\n      - "80:80"\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.valid).toBe(false);
    expect(result!.issues.some((i) => i.severity === "error" && i.message.includes("image"))).toBe(true);
  });

  it("warns on unknown top-level key", () => {
    const yaml = `${MINIMAL_VALID}\nfoo: bar\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "warning" && i.path === "foo")).toBe(true);
  });

  it("adds info for version field", () => {
    const yaml = `version: '3'\n${MINIMAL_VALID}`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "info" && i.path === "version")).toBe(true);
  });

  it("errors on invalid depends_on reference", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    depends_on:\n      - missing_service\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.valid).toBe(false);
    expect(result!.issues.some((i) => i.message.includes("missing_service"))).toBe(true);
  });

  it("accepts valid depends_on reference", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    depends_on:\n      - db\n  db:\n    image: postgres\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.filter((i) => i.severity === "error" && i.path.includes("depends_on"))).toHaveLength(0);
  });

  it("warns on unknown restart policy", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    restart: unknown-policy\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "warning" && i.path.includes("restart"))).toBe(true);
  });

  it("does not warn on valid restart policies", () => {
    for (const policy of ["no", "always", "on-failure", "unless-stopped"]) {
      const yaml = `services:\n  web:\n    image: nginx\n    restart: ${policy}\n`;
      const { result } = validateDockerCompose(yaml);
      expect(result!.issues.filter((i) => i.path.includes("restart"))).toHaveLength(0);
    }
  });

  it("warns on unusual port format", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    ports:\n      - "badport"\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "warning" && i.path.includes("ports"))).toBe(true);
  });

  it("adds info for environment variable without value", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    environment:\n      - MY_VAR\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "info" && i.message.includes("MY_VAR"))).toBe(true);
  });

  it("warns on volume with host path but no container path", () => {
    const yaml = `services:\n  web:\n    image: nginx\n    volumes:\n      - /host/path\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.issues.some((i) => i.severity === "warning" && i.path.includes("volumes"))).toBe(true);
  });

  it("returns service list with multiple services", () => {
    const yaml = `services:\n  web:\n    image: nginx\n  api:\n    image: node\n  db:\n    image: postgres\n`;
    const { result } = validateDockerCompose(yaml);
    expect(result!.serviceCount).toBe(3);
    expect(result!.services).toContain("web");
    expect(result!.services).toContain("api");
    expect(result!.services).toContain("db");
  });
});
