export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
}

/** Decode a Base64URL segment to a UTF-8 string. */
export function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}

/** Decode a JWT token into its parts. Does NOT verify the signature. */
export function decodeJwt(token: string): { result: DecodedJwt | null; error: string | null } {
  if (!token.trim()) return { result: null, error: null };
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return {
      result: null,
      error: "Invalid JWT: must have 3 parts (header.payload.signature)",
    };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const isExpired =
      "exp" in payload ? Date.now() / 1000 > (payload.exp as number) : null;
    return {
      result: { header, payload, signature: parts[2], isExpired },
      error: null,
    };
  } catch (e) {
    return {
      result: null,
      error: e instanceof Error ? e.message : "Failed to decode JWT",
    };
  }
}
