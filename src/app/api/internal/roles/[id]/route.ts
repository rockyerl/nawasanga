import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { roles, rolePermissions, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = await db.query.roles.findFirst({
      where: eq(roles.id, id),
      with: {
        rolePermissions: {
          with: { permission: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ code: 404, status: "Not Found", message: "Role tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      data: {
        id: role.id,
        name: role.name,
        roleName: role.name,
        code: role.code,
        description: role.description,
        permissions: role.rolePermissions.map((rp) => rp.permission?.code).filter(Boolean),
        isSystem: role.isSystem,
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const role = await db.query.roles.findFirst({
      where: eq(roles.id, id),
    });
    if (!role) {
      return NextResponse.json({ code: 404, status: "Not Found", message: "Role tidak ditemukan" }, { status: 404 });
    }

    await db
      .update(roles)
      .set({
        name: body.roleName || body.name || role.name,
        description: body.description !== undefined ? body.description : role.description,
        updatedAt: new Date(),
      })
      .where(eq(roles.id, id));

    // Update permissions if provided
    if (Array.isArray(body.permissions)) {
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));

      const allPerms = await db.select().from(permissions);
      const permMap = new Map(allPerms.map((p) => [p.code, p.id]));
      const nameMap = new Map(allPerms.map((p) => [p.name, p.id]));

      for (const pName of body.permissions) {
        const pId = permMap.get(pName) || nameMap.get(pName);
        if (pId) {
          await db.insert(rolePermissions).values({
            id: `rp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            roleId: id,
            permissionId: pId,
          });
        }
      }
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Role berhasil diperbarui",
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
    const role = await db.query.roles.findFirst({
      where: eq(roles.id, id),
    });

    if (role?.isSystem) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Role sistem bawaan tidak dapat dihapus." },
        { status: 400 }
      );
    }

    await db.delete(roles).where(eq(roles.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Role berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
