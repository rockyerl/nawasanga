import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, users, roles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allOrgs = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
    const filtered = search
      ? allOrgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
      : allOrgs;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data organisasi berhasil diambil",
      data: {
        items: items.map((o) => ({
          id: o.id,
          name: o.name,
          slug: o.slug,
          industry: o.industry || "logistics",
          personInCharge: o.contactEmail,
          contactEmail: o.contactEmail,
          contactPhone: o.contactPhone || "-",
          address: o.address || "-",
          city: o.city || "Jakarta Pusat",
          province: o.province || "DKI Jakarta",
          latitude: o.latitude ?? -6.2088,
          longitude: o.longitude ?? 106.8456,
          npwp: "01.234.567.8-901.000",
          plan: o.plan,
          subscriptionPlan: o.plan || "starter",
          subscriptionExpiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
          maxAssets: o.maxAssets,
          status: o.status,
          isActive: o.status === "active",
          createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
        })),
        count: filtered.length,
        page,
        itemPerPage,
        totalPages: Math.max(1, Math.ceil(filtered.length / itemPerPage)),
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();
    const newOrg = {
      id: `org_${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      industry: body.industry || "Logistics",
      contactEmail: body.contactEmail || body.personInCharge || "admin@example.com",
      contactPhone: body.contactPhone || "-",
      address: body.address || "-",
      city: body.city || null,
      province: body.province || null,
      latitude: body.latitude != null ? Number(body.latitude) : null,
      longitude: body.longitude != null ? Number(body.longitude) : null,
      plan: body.plan || "starter",
      maxAssets: parseInt(body.maxAssets, 10) || 10,
      status: body.status || "active",
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(organizations).values(newOrg);

    // Auto-provision PIC client admin user if contact email is provided
    if (newOrg.contactEmail && newOrg.contactEmail.includes("@")) {
      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, newOrg.contactEmail.toLowerCase()),
        });
        if (!existingUser) {
          const clientAdminRole = await db.query.roles.findFirst({
            where: eq(roles.code, "CLIENT_ADMIN"),
          });
          const passwordHash = await bcrypt.hash("Password@123", 10);
          await db.insert(users).values({
            id: `usr_${Date.now()}`,
            organizationId: newOrg.id,
            name: body.picName || `Admin ${newOrg.name}`,
            email: newOrg.contactEmail.toLowerCase(),
            passwordHash,
            roleId: clientAdminRole?.id || "role_client_admin",
            createdAt: now,
            updatedAt: now,
          });
        }
      } catch (userErr) {
        console.error("Failed to auto-provision PIC user:", userErr);
      }
    }

    return NextResponse.json({ code: 201, status: "Created", message: "Organisasi berhasil didaftarkan", data: newOrg });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
