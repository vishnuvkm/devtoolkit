export interface SubnetInfo {
  ip: string;
  network: string;
  broadcast: string;
  mask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  prefix: number;
  totalHosts: number;
  usableHosts: number;
  cidr: string;
  ipClass: string;
  binaryMask: string;
}

function ipToNum(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, oct) => (acc * 256 + parseInt(oct, 10)) >>> 0, 0);
}

function numToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join(".");
}

function numToBinaryDotted(n: number): string {
  return [
    ((n >>> 24) & 0xff).toString(2).padStart(8, "0"),
    ((n >>> 16) & 0xff).toString(2).padStart(8, "0"),
    ((n >>> 8) & 0xff).toString(2).padStart(8, "0"),
    (n & 0xff).toString(2).padStart(8, "0"),
  ].join(".");
}

function getIpClass(firstOctet: number): string {
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D (Multicast)";
  return "E (Reserved)";
}

export function parseSubnet(
  cidr: string
): { result: SubnetInfo | null; error: string | null } {
  const trimmed = cidr.trim();
  if (!trimmed) return { result: null, error: null };

  const match = trimmed.match(
    /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/
  );
  if (!match) {
    return {
      result: null,
      error: "Invalid format — use CIDR notation like 192.168.1.0/24",
    };
  }

  const [, ipStr, prefixStr] = match;
  const prefix = parseInt(prefixStr, 10);

  if (prefix > 32) {
    return { result: null, error: "Prefix must be between 0 and 32" };
  }

  const octets = ipStr.split(".").map(Number);
  if (octets.some((o) => o > 255)) {
    return {
      result: null,
      error: "IP address octets must be between 0 and 255",
    };
  }

  const ipNum = ipToNum(ipStr);
  const mask = prefix === 0 ? 0 : ((~0) << (32 - prefix)) >>> 0;
  const wildcardMask = (~mask) >>> 0;
  const networkNum = (ipNum & mask) >>> 0;
  const broadcastNum = (networkNum | wildcardMask) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);

  let usableHosts: number;
  let firstHost: number;
  let lastHost: number;

  if (prefix === 32) {
    usableHosts = 1;
    firstHost = networkNum;
    lastHost = networkNum;
  } else if (prefix === 31) {
    usableHosts = 2;
    firstHost = networkNum;
    lastHost = broadcastNum;
  } else {
    usableHosts = totalHosts - 2;
    firstHost = networkNum + 1;
    lastHost = broadcastNum - 1;
  }

  return {
    result: {
      ip: ipStr,
      network: numToIp(networkNum),
      broadcast: numToIp(broadcastNum),
      mask: numToIp(mask),
      wildcardMask: numToIp(wildcardMask),
      firstHost: numToIp(firstHost),
      lastHost: numToIp(lastHost),
      prefix,
      totalHosts,
      usableHosts,
      cidr: `${numToIp(networkNum)}/${prefix}`,
      ipClass: getIpClass(octets[0]),
      binaryMask: numToBinaryDotted(mask),
    },
    error: null,
  };
}
