import { describe, it, expect } from "vitest";
import { base64UrlDecode, decodeJwt } from "@/lib/jwt-utils";

// Well-known test JWT from jwt.io (alg: HS256, no exp)
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function makeJwt(payload: object): string {
  const enc = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return `${enc({ alg: "HS256", typ: "JWT" })}.${enc(payload)}.fakesig`;
}

describe("base64UrlDecode", () => {
  it("decodes the header of the sample JWT", () => {
    const decoded = base64UrlDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    expect(JSON.parse(decoded)).toEqual({ alg: "HS256", typ: "JWT" });
  });
  it("handles missing padding", () => {
    // "eyJhIjoiYiJ9" is {"a":"b"} without padding issues
    const decoded = base64UrlDecode("eyJhIjoiYiJ9");
    expect(JSON.parse(decoded)).toEqual({ a: "b" });
  });
});

describe("decodeJwt", () => {
  it("decodes a valid JWT header and payload", () => {
    const { result, error } = decodeJwt(SAMPLE_JWT);
    expect(error).toBeNull();
    expect(result).not.toBeNull();
    expect(result!.header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(result!.payload).toMatchObject({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });
  it("captures the signature part", () => {
    const { result } = decodeJwt(SAMPLE_JWT);
    expect(result!.signature).toBe(
      "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
  });
  it("returns null isExpired when no exp claim", () => {
    const { result } = decodeJwt(SAMPLE_JWT);
    expect(result!.isExpired).toBeNull();
  });
  it("marks token as expired when exp is in the past", () => {
    const { result } = decodeJwt(makeJwt({ sub: "1", exp: 1000 }));
    expect(result!.isExpired).toBe(true);
  });
  it("marks token as valid when exp is in the future", () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const { result } = decodeJwt(makeJwt({ sub: "1", exp: futureExp }));
    expect(result!.isExpired).toBe(false);
  });
  it("returns error for token with wrong number of parts", () => {
    const { result, error } = decodeJwt("header.payload");
    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
  it("returns nulls for empty token", () => {
    const { result, error } = decodeJwt("");
    expect(result).toBeNull();
    expect(error).toBeNull();
  });
  it("returns error for garbled base64", () => {
    const { result, error } = decodeJwt("!!!.!!!.!!!");
    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
});
