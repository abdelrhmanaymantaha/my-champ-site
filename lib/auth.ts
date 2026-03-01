import { createHmac, randomBytes } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret";

export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return false;
  }
  return email === adminEmail && password === adminPassword;
}

export function createSessionToken(): string {
  const payload = `${Date.now()}-${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    return signature === expected;
  } catch {
    return false;
  }
}

export function getSessionCookie(): string {
  return SESSION_COOKIE;
}
