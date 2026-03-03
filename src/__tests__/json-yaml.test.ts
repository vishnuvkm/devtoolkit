import { describe, it, expect } from "vitest";
import { jsonToYaml, yamlToJson } from "@/lib/json-yaml-utils";

describe("jsonToYaml", () => {
  it("converts a simple flat object", () => {
    const { output, error } = jsonToYaml('{"name": "Alice", "age": 30}');
    expect(error).toBeNull();
    expect(output).toContain("name: Alice");
    expect(output).toContain("age: 30");
  });
  it("converts nested object", () => {
    const { output, error } = jsonToYaml('{"a": {"b": 1}}');
    expect(error).toBeNull();
    expect(output).toContain("a:");
    expect(output).toContain("b: 1");
  });
  it("converts arrays", () => {
    const { output, error } = jsonToYaml('{"items": [1, 2, 3]}');
    expect(error).toBeNull();
    expect(output).toContain("- 1");
  });
  it("returns error for invalid JSON", () => {
    const { output, error } = jsonToYaml("{invalid json}");
    expect(output).toBe("");
    expect(error).toBeTruthy();
  });
  it("returns empty output for empty input", () => {
    const { output, error } = jsonToYaml("");
    expect(output).toBe("");
    expect(error).toBeNull();
  });
  it("returns empty for whitespace-only input", () => {
    const { output, error } = jsonToYaml("   ");
    expect(output).toBe("");
    expect(error).toBeNull();
  });
});

describe("yamlToJson", () => {
  it("converts a simple flat YAML document", () => {
    const { output, error } = yamlToJson("name: Alice\nage: 30");
    expect(error).toBeNull();
    expect(JSON.parse(output)).toEqual({ name: "Alice", age: 30 });
  });
  it("converts nested YAML", () => {
    const { output, error } = yamlToJson("a:\n  b: 1");
    expect(error).toBeNull();
    expect(JSON.parse(output)).toEqual({ a: { b: 1 } });
  });
  it("converts YAML arrays", () => {
    const { output, error } = yamlToJson("items:\n  - 1\n  - 2");
    expect(error).toBeNull();
    expect(JSON.parse(output)).toEqual({ items: [1, 2] });
  });
  it("returns empty for empty input", () => {
    const { output, error } = yamlToJson("");
    expect(output).toBe("");
    expect(error).toBeNull();
  });
});

describe("round-trip", () => {
  it("JSON → YAML → JSON preserves all values", () => {
    const original = '{"x": 1, "y": [1, 2, 3], "z": {"nested": true}}';
    const { output: yamlOut } = jsonToYaml(original);
    const { output: jsonOut } = yamlToJson(yamlOut);
    expect(JSON.parse(jsonOut)).toEqual(JSON.parse(original));
  });
});
