import * as bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const COOKIE_NAME = "fh_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const ALLOWED_REGISTRATION_EMAIL = "watson.briant@gmail.com";
const ALLOWED_DOMAIN = "@freedomhouse.cc";

export function isEmailAllowedForRegistration(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return (
    normalized === ALLOWED_REGISTRATION_EMAIL ||
    normalized.endsWith(ALLOWED_DOMAIN)
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: {
  sub: string;
  email: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new jose.SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<{ sub: string; email: string } | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") return null;
    return { sub, email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{
  userId: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;
  return { userId: session.sub, email: session.email };
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}
