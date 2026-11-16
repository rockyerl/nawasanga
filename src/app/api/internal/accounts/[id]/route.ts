import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { picName, email, position, password, status } = body;

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
      with: {
        users: true,
      },
    });

    if (!org) {
      return NextResponse.json(
        { code: 404, status: "Not Found", message: "Organisasi tidak ditemukan." },
        { status: 404 }
      );
    }

    const now = new Date();
    const cleanEmail = email ? email.toLowerCase().trim() : org.contactEmail;

    // Update organization contactEmail
    await db
      .update(organizations)
      .set({
        contactEmail: cleanEmail,
        updatedAt: now,
      })
      .where(eq(organizations.id, id));

    // Find existing PIC user for this organization
    const picUser = org.users?.find((u) => u.roleId === "role_company_admin") || org.users?.[0];

    if (picUser) {
      const updateData: {
        name?: string;
        email?: string;
        isActive?: boolean;
        passwordHash?: string;
        updatedAt: Date;
      } = {
        name: picName?.trim() || picUser.name,
        email: cleanEmail,
        isActive: status !== undefined ? status !== "inactive" : picUser.isActive,
        updatedAt: now,
      };

      if (password && password.trim()) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(password.trim(), salt);
      }

      await db.update(users).set(updateData).where(eq(users.id, picUser.id));
    } else if (picName && cleanEmail) {
      // Create user if not existing
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || "Sundawa123!", salt);
      await db.insert(users).values({
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        organizationId: org.id,
        name: picName.trim(),
        email: cleanEmail,
        passwordHash,
        roleId: "role_company_admin",
        isActive: status !== "inactive",
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: `Data akun PIC "${picName || org.name}" berhasil diperbarui.`,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete users associated with this organization first or delete organization
    await db.delete(users).where(eq(users.organizationId, id));
    await db.delete(organizations).where(eq(organizations.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Akun organisasi dan user terkait berhasil dihapus.",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
