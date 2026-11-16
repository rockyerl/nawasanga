import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { drivers, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const orgFilter = searchParams.get("organizationId") || (session?.roleCode !== "SUPERADMIN" ? session?.organizationId : null);

    const allDrivers = await db
      .select()
      .from(drivers)
      .where(orgFilter ? eq(drivers.organizationId, orgFilter) : undefined)
      .orderBy(desc(drivers.createdAt));

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
        items: items.map((d) => ({
          id: d.id,
          name: d.name,
          employeeId: d.id.replace("drv_", "EMP-").toUpperCase(),
          licenseType: "SIM B2 Umum",
          licenseNumber: d.licenseNumber,
          licenseExpiry: new Date(new Date(d.createdAt).getTime() + 365 * 24 * 3600 * 1000 * 3).toISOString(),
          phone: d.phoneNumber,
          phoneNumber: d.phoneNumber,
          locationName: "Pool Utama Cikarang",
          status: d.status === "active" ? "Aktif" : "Tidak Aktif",
          organizationId: d.organizationId,
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

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    let targetOrgId = body.organizationId || session?.organizationId;
    if (!targetOrgId) {
      const defaultOrg = await db.query.organizations.findFirst();
      targetOrgId = defaultOrg?.id || "org_nusantara_logistik";
    }

    const newDriver = {
      id: `drv_${Date.now()}`,
      organizationId: targetOrgId,
      name: body.name,
      licenseNumber: body.licenseNumber,
      phoneNumber: body.phoneNumber || body.phone || "-",
      status: body.status || "active",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(drivers).values(newDriver);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Driver berhasil ditambahkan",
      data: newDriver,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
