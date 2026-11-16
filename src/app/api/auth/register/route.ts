import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, users, roles, subscriptions, billingInvoices, rolePermissions, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import type { UserSession } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim() || `${body.firstName || ""} ${body.lastName || ""}`.trim() || "Penanggung Jawab Klien";
    const companyName = body.companyName?.trim() || "PT Nawasanga Klien Baru";
    const password = body.password || "Nawasanga2026!";
    const plan = (body.plan === "freemium" ? "starter" : body.plan || "starter").toLowerCase();
    const billingPeriod = body.billingPeriod || "monthly";
    const paymentMethod = body.paymentMethod || "Virtual Account";
    const amountIdr = Number(body.amountIdr) || (plan === "pro" ? 1500000 : plan === "starter" ? 799000 : 0);

    if (!email) {
      return NextResponse.json({ code: 400, status: "Bad Request", message: "Email wajib diisi" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({
        code: 409,
        status: "Conflict",
        message: "Email ini sudah terdaftar di platform. Silakan gunakan menu Masuk / Login.",
      }, { status: 409 });
    }

    const now = new Date();
    const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 30);
    const orgId = `org_${baseSlug}_${Date.now().toString().slice(-4)}`;

    // 2. Insert Organization
    const maxAssets = plan === "enterprise" ? 500 : plan === "pro" ? 80 : 15;
    await db.insert(organizations).values({
      id: orgId,
      name: companyName,
      slug: `${baseSlug}-${Date.now().toString().slice(-4)}`,
      industry: body.sector || body.industry || "Fleet & Logistik",
      contactEmail: email,
      contactPhone: body.phone || "-",
      address: body.corpAddress || body.address || "-",
      city: body.city || "Jakarta",
      province: body.province || "DKI Jakarta",
      plan: plan,
      maxAssets: maxAssets,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    // 3. Find Company Admin Role
    let adminRole = await db.query.roles.findFirst({
      where: eq(roles.code, "COMPANY_ADMIN"),
    });

    if (!adminRole) {
      const allRoles = await db.query.roles.findMany();
      adminRole = allRoles.find((r) => r.code !== "SUPERADMIN") || allRoles[0];
    }

    const roleId = adminRole?.id || "role_company_admin";
    const roleName = adminRole?.name || "Company Admin";
    const roleCode = adminRole?.code || "COMPANY_ADMIN";

    // 4. Create User Account
    const hashedPassword = await hashPassword(password);
    const userId = `usr_${Date.now()}`;

    await db.insert(users).values({
      id: userId,
      organizationId: orgId,
      name: name,
      email: email,
      passwordHash: hashedPassword,
      roleId: roleId,
      avatarUrl: null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // 5. Create Subscription
    const durationDays = billingPeriod === "yearly" ? 365 : 30;
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 3600 * 1000);

    await db.insert(subscriptions).values({
      id: `sub_${Date.now()}`,
      organizationId: orgId,
      plan: plan,
      billingCycle: billingPeriod,
      priceIdr: amountIdr,
      startsAt: now,
      expiresAt: expiresAt,
      status: "active",
    });

    // 6. Create Paid Billing Invoice
    const invoiceNumber = `INV/${now.getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
    await db.insert(billingInvoices).values({
      id: `inv_${Date.now()}`,
      organizationId: orgId,
      invoiceNumber: invoiceNumber,
      amountIdr: amountIdr,
      status: "paid",
      paymentMethod: paymentMethod,
      paidAt: now,
      createdAt: now,
    });

    // 7. Fetch permissions for the role
    const assignedPermissions = await db
      .select({ code: permissions.code })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    const permissionCodes = assignedPermissions.map((p) => p.code);

    // 8. Sign JWT Session Token
    const session: UserSession = {
      userId: userId,
      email: email,
      name: name,
      roleId: roleId,
      roleCode: roleCode,
      roleName: roleName,
      organizationId: orgId,
      organizationName: companyName,
      permissions: permissionCodes,
    };

    const token = await signSessionToken(session);

    // 9. Response with Set-Cookie
    const response = NextResponse.json({
      code: 201,
      status: "Created",
      message: "Registrasi akun perusahaan dan langganan berhasil diaktifkan.",
      data: {
        organizationId: orgId,
        organizationName: companyName,
        user: { id: userId, email, name, roleName },
        invoiceNumber,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
