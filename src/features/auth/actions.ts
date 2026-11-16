"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { users, roles, rolePermissions, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import type { UserSession } from "@/types";

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    name: string;
    email: string;
    roleName: string;
    roleCode: string;
  };
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  try {
    // 1. Fetch user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        role: true,
        organization: true,
      },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "Akun tidak ditemukan atau tidak aktif." };
    }

    // 2. Verify password with bcrypt
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Kata sandi yang Anda masukkan salah." };
    }

    // 3. Fetch permissions for the role
    const assignedPermissions = await db
      .select({ code: permissions.code })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, user.roleId));

    const permissionCodes = assignedPermissions.map((p) => p.code);

    // 4. Construct user session
    const session: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleCode: user.role.code,
      roleName: user.role.name,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || null,
      permissions: permissionCodes,
    };

    // 5. Sign JWT session token
    const token = await signSessionToken(session);

    // 6. Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        roleName: user.role.name,
        roleCode: user.role.code,
      },
    };
  } catch (err) {
    console.error("Login action error:", err);
    return { success: false, error: "Terjadi kesalahan internal saat memproses autentikasi." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const { verifySessionToken } = await import("@/lib/auth");
  return verifySessionToken(token);
}
