import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.status !== undefined) updateData.isActive = body.status === "Aktif" || body.status === true;

    if (body.role || body.roleId) {
      const roleRecord = await db.query.roles.findFirst({
        where: (r, { eq, or }) => or(eq(r.name, body.role || ""), eq(r.id, body.roleId || body.role || "")),
      });
      if (roleRecord) {
        updateData.roleId = roleRecord.id;
      }
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data pengguna berhasil diperbarui",
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
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "User berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
