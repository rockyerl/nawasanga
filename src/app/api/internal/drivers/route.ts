import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { drivers } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allDrivers = await db.select().from(drivers).orderBy(desc(drivers.createdAt));
    const filtered = search
      ? allDrivers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber.includes(search))
      : allDrivers;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data driver berhasil diambil",
      data: {
        items,
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
    const newDriver = {
      id: `drv_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      name: body.name,
      licenseNumber: body.licenseNumber,
      phoneNumber: body.phoneNumber || body.phone || "-",
      status: body.status || "active",
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(drivers).values(newDriver);
    return NextResponse.json({ code: 201, status: "Created", message: "Driver berhasil ditambahkan", data: newDriver });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
