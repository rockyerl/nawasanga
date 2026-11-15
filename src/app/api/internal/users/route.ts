import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const userList = await db.query.users.findMany({
      with: {
        role: true,
        organization: true,
      },
      orderBy: [desc(users.createdAt)],
    });

    const filtered = search
      ? userList.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
      : userList;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data user berhasil diambil",
      data: {
        items: items.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: "+62 812-3456-7890",
          role: u.role?.name || "Member",
          status: u.isActive ? "Aktif" : "Tidak Aktif",
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
    const defaultPassword = await bcrypt.hash("User@12345", 10);
    
    // Find role
    const defaultRole = await db.query.roles.findFirst();

    const newUser = {
      id: `usr_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      name: body.name,
      email: body.email,
      passwordHash: defaultPassword,
      roleId: body.roleId || defaultRole?.id || "role_company_admin",
      isActive: body.status !== "Tidak Aktif",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Pengguna berhasil ditambahkan",
      data: newUser,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
