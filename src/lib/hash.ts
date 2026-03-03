/** Pure-JS MD5 — Web Crypto API does not support MD5. */
export function md5(input: Uint8Array): string {
  const msg = Array.from(input);
  const origBits = msg.length * 8;
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  for (let i = 0; i < 4; i++) msg.push((origBits >>> (i * 8)) & 0xff);
  for (let i = 0; i < 4; i++) msg.push(0); // high 32 bits of length (always 0 here)

  const K = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0
  );
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let o = 0; o < msg.length; o += 64) {
    const M = Array.from({ length: 16 }, (_, j) =>
      (msg[o + j * 4] | (msg[o + j * 4 + 1] << 8) | (msg[o + j * 4 + 2] << 16) | (msg[o + j * 4 + 3] << 24)) >>> 0
    );
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      const tmp = D; D = C; C = B;
      const sum = (A + F + K[i] + M[g]) >>> 0;
      B = (B + ((sum << S[i]) | (sum >>> (32 - S[i])))) >>> 0;
      A = tmp;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }

  return [a0, b0, c0, d0]
    .map((n) =>
      Array.from({ length: 4 }, (_, i) => ((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0")).join("")
    )
    .join("");
}

export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export async function computeHashes(data: Uint8Array): Promise<HashResult> {
  const toHex = (buf: ArrayBuffer) =>
    Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const rawBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  const [sha1, sha256, sha512] = await Promise.all([
    crypto.subtle.digest("SHA-1", rawBuffer).then(toHex),
    crypto.subtle.digest("SHA-256", rawBuffer).then(toHex),
    crypto.subtle.digest("SHA-512", rawBuffer).then(toHex),
  ]);
  return { md5: md5(data), sha1, sha256, sha512 };
}
