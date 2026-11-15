import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const orgs = await db.query.organizations.findMany({
      with: {
        users: true,
      },
      orderBy: [desc(organizations.createdAt)],
    });

    const filtered = search
      ? orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
      : orgs;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data akun organisasi berhasil diambil",
      data: {
        items: items.map((o) => ({
          id: o.id,
          companyName: o.name,
          picName: o.users?.[0]?.name || "Penanggung Jawab Klien",
          position: "Fleet Operations Manager",
          email: o.contactEmail,
          subscriptionPlan: o.plan,
          lastActivityAt: new Date(o.updatedAt).toISOString().split("T")[0],
          status: o.status === "active" ? "active" : "inactive",
          createdAt: new Date(o.createdAt).toISOString().split("T")[0],
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
    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Akun organisasi berhasil dibuat",
      data: body,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
