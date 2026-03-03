import { describe, it, expect } from "vitest";
import { md5, computeHashes } from "@/lib/hash";

const encode = (s: string) => new TextEncoder().encode(s);

describe("md5", () => {
  it("produces known hash for empty string", () => {
    expect(md5(encode(""))).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });
  it('produces known hash for "hello"', () => {
    expect(md5(encode("hello"))).toBe("5d41402abc4b2a76b9719d911017c592");
  });
  it('produces known hash for "abc"', () => {
    expect(md5(encode("abc"))).toBe("900150983cd24fb0d6963f7d28e17f72");
  });
  it("returns a 32-character lowercase hex string", () => {
    expect(md5(encode("test"))).toMatch(/^[0-9a-f]{32}$/);
  });
  it("produces different hashes for different inputs", () => {
    expect(md5(encode("foo"))).not.toBe(md5(encode("bar")));
  });
});

describe("computeHashes", () => {
  it("returns all four hashes for empty string", async () => {
    const result = await computeHashes(encode(""));
    expect(result.md5).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(result.sha1).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709");
    expect(result.sha256).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    expect(result.sha512).toMatch(/^[0-9a-f]{128}$/);
  });
  it('returns correct sha256 for "hello"', async () => {
    const result = await computeHashes(encode("hello"));
    expect(result.sha256).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });
  it("md5 and sha1 agree with standalone functions", async () => {
    const data = encode("devtools");
    const result = await computeHashes(data);
    expect(result.md5).toBe(md5(data));
    expect(result.md5).toMatch(/^[0-9a-f]{32}$/);
    expect(result.sha1).toMatch(/^[0-9a-f]{40}$/);
    expect(result.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(result.sha512).toMatch(/^[0-9a-f]{128}$/);
  });
});
