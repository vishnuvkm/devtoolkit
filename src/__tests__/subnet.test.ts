import { describe, it, expect } from "vitest";
import { parseSubnet } from "../lib/subnet";

describe("parseSubnet", () => {
  it("returns null for empty input", () => {
    const { result, error } = parseSubnet("  ");
    expect(result).toBeNull();
    expect(error).toBeNull();
  });

  it("returns error for invalid format", () => {
    const { result, error } = parseSubnet("192.168.1.1");
    expect(result).toBeNull();
    expect(error).toMatch(/invalid format/i);
  });

  it("returns error for prefix > 32", () => {
    const { result, error } = parseSubnet("10.0.0.0/33");
    expect(result).toBeNull();
    expect(error).toMatch(/prefix/i);
  });

  it("returns error for invalid octet > 255", () => {
    const { result, error } = parseSubnet("256.0.0.0/24");
    expect(result).toBeNull();
    expect(error).toMatch(/octet/i);
  });

  it("calculates /24 correctly", () => {
    const { result, error } = parseSubnet("192.168.1.0/24");
    expect(error).toBeNull();
    expect(result).not.toBeNull();
    expect(result!.network).toBe("192.168.1.0");
    expect(result!.broadcast).toBe("192.168.1.255");
    expect(result!.mask).toBe("255.255.255.0");
    expect(result!.wildcardMask).toBe("0.0.0.255");
    expect(result!.firstHost).toBe("192.168.1.1");
    expect(result!.lastHost).toBe("192.168.1.254");
    expect(result!.totalHosts).toBe(256);
    expect(result!.usableHosts).toBe(254);
    expect(result!.prefix).toBe(24);
    expect(result!.cidr).toBe("192.168.1.0/24");
    expect(result!.ipClass).toBe("C");
  });

  it("calculates /8 correctly", () => {
    const { result } = parseSubnet("10.0.0.0/8");
    expect(result!.network).toBe("10.0.0.0");
    expect(result!.broadcast).toBe("10.255.255.255");
    expect(result!.mask).toBe("255.0.0.0");
    expect(result!.totalHosts).toBe(16777216);
    expect(result!.usableHosts).toBe(16777214);
    expect(result!.ipClass).toBe("A");
  });

  it("handles /32 (single host)", () => {
    const { result } = parseSubnet("192.168.1.50/32");
    expect(result!.totalHosts).toBe(1);
    expect(result!.usableHosts).toBe(1);
    expect(result!.firstHost).toBe("192.168.1.50");
    expect(result!.lastHost).toBe("192.168.1.50");
    expect(result!.network).toBe("192.168.1.50");
    expect(result!.broadcast).toBe("192.168.1.50");
  });

  it("handles /31 (point-to-point, 2 hosts)", () => {
    const { result } = parseSubnet("10.0.0.0/31");
    expect(result!.totalHosts).toBe(2);
    expect(result!.usableHosts).toBe(2);
    expect(result!.firstHost).toBe("10.0.0.0");
    expect(result!.lastHost).toBe("10.0.0.1");
  });

  it("handles /0 (all addresses)", () => {
    const { result } = parseSubnet("0.0.0.0/0");
    expect(result!.network).toBe("0.0.0.0");
    expect(result!.broadcast).toBe("255.255.255.255");
    expect(result!.totalHosts).toBe(4294967296);
  });

  it("normalises the network address from a host address", () => {
    // 192.168.1.100/24 → network should be 192.168.1.0
    const { result } = parseSubnet("192.168.1.100/24");
    expect(result!.network).toBe("192.168.1.0");
    expect(result!.cidr).toBe("192.168.1.0/24");
  });

  it("identifies Class B correctly", () => {
    const { result } = parseSubnet("172.16.0.0/12");
    expect(result!.ipClass).toBe("B");
  });

  it("includes binary mask in output", () => {
    const { result } = parseSubnet("192.168.1.0/24");
    expect(result!.binaryMask).toBe("11111111.11111111.11111111.00000000");
  });

  it("calculates /26 subnet", () => {
    const { result } = parseSubnet("192.168.100.128/26");
    expect(result!.network).toBe("192.168.100.128");
    expect(result!.broadcast).toBe("192.168.100.191");
    expect(result!.usableHosts).toBe(62);
    expect(result!.firstHost).toBe("192.168.100.129");
    expect(result!.lastHost).toBe("192.168.100.190");
  });
});
