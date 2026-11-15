import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { UserSession } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "sundawa-fuel-carbon-super-secret-jwt-key-32chars"
);

export const SESSION_COOKIE_NAME = "fuel_carbon_session";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function signSessionToken(session: UserSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

/**
 * Check if the current user session has the given permission
 */
export function hasPermission(
  session: UserSession | null | undefined,
  requiredPermission: string
): boolean {
  if (!session) return false;
  // Superadmin has wildcard access
  if (session.roleCode === "SUPERADMIN") return true;
  return session.permissions?.includes(requiredPermission) ?? false;
}

/**
 * Check if the user has any of the required permissions
 */
export function hasAnyPermission(
  session: UserSession | null | undefined,
  requiredPermissions: string[]
): boolean {
  if (!session) return false;
  if (session.roleCode === "SUPERADMIN") return true;
  return requiredPermissions.some((perm) => session.permissions?.includes(perm));
}
