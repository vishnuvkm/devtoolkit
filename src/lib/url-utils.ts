export interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  href: string;
  params: [string, string][];
}

export function parseUrl(raw: string): { result: ParsedUrl | null; error: string | null } {
  try {
    const u = new URL(raw.trim());
    const params: [string, string][] = [];
    u.searchParams.forEach((v, k) => params.push([k, v]));
    return {
      result: {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        origin: u.origin,
        href: u.href,
        params,
      },
      error: null,
    };
  } catch {
    return { result: null, error: "Invalid URL — include protocol (e.g. https://)" };
  }
}

export function encodeUrlComponent(s: string): string {
  return encodeURIComponent(s);
}

export function decodeUrlComponent(s: string): { result: string; error: string | null } {
  try {
    return { result: decodeURIComponent(s), error: null };
  } catch {
    return { result: "", error: "Invalid encoded string" };
  }
}
