export const SESSION_COOKIE = "sa_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ iat: Date.now() })));
  const key = await hmacKey(secret);
  const sig = b64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const key = await hmacKey(secret);
  const expected = b64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return expected === sig;
}

export function sessionCookieOptions(maxAge = COOKIE_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
