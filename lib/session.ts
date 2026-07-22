import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload } from "./auth-types";

const COOKIE = "mg_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-please-set-SESSION_SECRET-in-env"
);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(data: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ ...data, expiresAt: expiresAt.toISOString() });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function deleteSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
