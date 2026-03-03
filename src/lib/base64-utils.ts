/** Encode a string to Base64. Set urlSafe=true to use URL-safe alphabet (no +/= chars). */
export function toBase64(text: string, urlSafe: boolean): string {
  const encoded = btoa(unescape(encodeURIComponent(text)));
  return urlSafe
    ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    : encoded;
}

/** Decode a Base64 (or URL-safe Base64) string back to text. */
export function fromBase64(b64: string): string {
  // Normalize URL-safe alphabet back to standard
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    // Binary / non-UTF-8 fallback
    return atob(padded);
  }
}
