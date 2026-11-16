import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const orgs = await db.query.organizations.findMany({
      with: {
        users: {
          with: {
            role: true,
          },
        },
      },
      orderBy: [desc(organizations.createdAt)],
    });

    const filtered = search
      ? orgs.filter((o) => {
          const s = search.toLowerCase();
          const matchOrg = o.name.toLowerCase().includes(s);
          const matchEmail = o.contactEmail?.toLowerCase().includes(s);
          const matchPic = o.users?.some((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
          return matchOrg || matchEmail || matchPic;
        })
      : orgs;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data akun organisasi berhasil diambil",
      data: {
        items: items.map((o) => {
          const picUser = o.users?.find((u) => u.role?.code === "COMPANY_ADMIN") || o.users?.[0];
          const picName = picUser?.name || "Penanggung Jawab Klien";
          const picEmail = picUser?.email || o.contactEmail;
          const isActive = picUser ? picUser.isActive : o.status === "active";

          return {
            id: o.id,
            organizationId: o.id,
            companyName: o.name,
            picName,
            position: "Fleet Operations Manager",
            email: picEmail,
            subscriptionPlan: o.plan || "starter",
            lastActivityAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : null,
            status: isActive ? "active" : "inactive",
            createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
          };
        }),
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
    const { organizationId, picName, email, position, password, status } = body;

    if (!organizationId) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Organisasi wajib dipilih." },
        { status: 400 }
      );
    }

    if (!picName?.trim()) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Nama penanggung jawab (PIC) wajib diisi." },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Email penanggung jawab wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Verify organization exists
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });

    if (!org) {
      return NextResponse.json(
        { code: 404, status: "Not Found", message: "Organisasi yang dipilih tidak ditemukan." },
        { status: 404 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const now = new Date();

    // 2. Check if a user with this email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db
        .update(users)
        .set({
          organizationId: org.id,
          name: picName.trim(),
          roleId: "role_company_admin",
          isActive: status !== "inactive",
          updatedAt: now,
        })
        .where(eq(users.id, existingUser.id));
    } else {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || "Sundawa123!", salt);

      await db.insert(users).values({
        id: userId,
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

    // 3. Update organization's contact email
    await db
      .update(organizations)
      .set({
        contactEmail: cleanEmail,
        updatedAt: now,
      })
      .where(eq(organizations.id, org.id));

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: `Akun PIC "${picName.trim()}" untuk organisasi "${org.name}" berhasil dibuat.`,
      data: {
        id: org.id,
        organizationId: org.id,
        companyName: org.name,
        picName: picName.trim(),
        position: position || "Fleet Operations Manager",
        email: cleanEmail,
        status: status !== "inactive" ? "active" : "inactive",
        createdAt: now.toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
