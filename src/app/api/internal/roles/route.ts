import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { roles, permissions, rolePermissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allRoles = await db.query.roles.findMany({
      with: {
        rolePermissions: {
          with: {
            permission: true,
          },
        },
      },
      orderBy: [desc(roles.createdAt)],
    });

    const filtered = search
      ? allRoles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()))
      : allRoles;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data role berhasil diambil",
      data: {
        items: items.map((r) => ({
          id: r.id,
          roleName: r.name,
          name: r.name,
          code: r.code,
          description: r.description || "-",
          permissions: r.rolePermissions?.map((rp) => rp.permission?.code || rp.permission?.name).filter(Boolean) || [],
          isSystem: r.isSystem,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
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
    const newRoleId = `role_${Date.now()}`;

    const newRole = {
      id: newRoleId,
      name: body.roleName || body.name,
      code: (body.code || body.roleName || "ROLE").toUpperCase().replace(/[^A-Z0-9]/g, "_"),
      description: body.description || "-",
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(roles).values(newRole);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Role berhasil ditambahkan",
      data: newRole,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
