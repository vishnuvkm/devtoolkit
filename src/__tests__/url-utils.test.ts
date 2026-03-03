import { describe, it, expect } from "vitest";
import { parseUrl, encodeUrlComponent, decodeUrlComponent } from "@/lib/url-utils";

describe("parseUrl", () => {
  it("parses a full URL", () => {
    const { result, error } = parseUrl(
      "https://api.example.com:8080/v1/search?q=hello&page=2#results"
    );
    expect(error).toBeNull();
    expect(result).not.toBeNull();
    expect(result!.protocol).toBe("https:");
    expect(result!.hostname).toBe("api.example.com");
    expect(result!.port).toBe("8080");
    expect(result!.pathname).toBe("/v1/search");
    expect(result!.hash).toBe("#results");
  });
  it("parses query params into array of tuples", () => {
    const { result } = parseUrl("https://example.com?a=1&b=hello");
    expect(result!.params).toEqual([
      ["a", "1"],
      ["b", "hello"],
    ]);
  });
  it("returns empty params for URL with no query string", () => {
    const { result } = parseUrl("https://example.com/path");
    expect(result!.params).toEqual([]);
    expect(result!.search).toBe("");
  });
  it("returns error for invalid URL", () => {
    const { result, error } = parseUrl("not-a-url");
    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
  it("returns error for URL without protocol", () => {
    const { result, error } = parseUrl("example.com/path");
    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
  it("parses origin correctly", () => {
    const { result } = parseUrl("https://example.com:3000/path");
    expect(result!.origin).toBe("https://example.com:3000");
  });
  it("handles URL with multiple query params", () => {
    const { result } = parseUrl("https://example.com?a=1&b=2&c=3");
    expect(result!.params).toHaveLength(3);
  });
});

describe("encodeUrlComponent", () => {
  it("encodes spaces as %20", () => {
    expect(encodeUrlComponent("hello world")).toBe("hello%20world");
  });
  it("encodes = and & characters", () => {
    expect(encodeUrlComponent("a=1&b=2")).toBe("a%3D1%26b%3D2");
  });
  it("does not encode unreserved chars", () => {
    expect(encodeUrlComponent("abc123-_.~")).toBe("abc123-_.~");
  });
  it("encodes forward slash", () => {
    expect(encodeUrlComponent("path/to/resource")).toBe("path%2Fto%2Fresource");
  });
});

describe("decodeUrlComponent", () => {
  it("decodes %20 as space", () => {
    const { result, error } = decodeUrlComponent("hello%20world");
    expect(error).toBeNull();
    expect(result).toBe("hello world");
  });
  it("decodes %2F as /", () => {
    const { result } = decodeUrlComponent("path%2Fto%2Fresource");
    expect(result).toBe("path/to/resource");
  });
  it("round-trips with encodeUrlComponent", () => {
    const original = "hello world / test & value=1";
    const { result } = decodeUrlComponent(encodeUrlComponent(original));
    expect(result).toBe(original);
  });
  it("returns error for invalid encoding", () => {
    const { result, error } = decodeUrlComponent("%zz");
    expect(result).toBe("");
    expect(error).toBeTruthy();
  });
});
