import { createHmac, randomBytes } from "crypto";

const SESSION_COOKIE = "admin_session";
const DEFAULT_ADMIN_EMAIL = "admin@aleven.com";
const DEFAULT_ADMIN_PASSWORD = "123456";
const SESSION_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getAdminEmail() {
  if (!IS_PRODUCTION) {
    return DEFAULT_ADMIN_EMAIL;
  }

  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;
}

function getAdminPassword() {
  if (!IS_PRODUCTION) {
    return DEFAULT_ADMIN_PASSWORD;
  }

  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();
  return email.trim().toLowerCase() === adminEmail && password.trim() === adminPassword;
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
