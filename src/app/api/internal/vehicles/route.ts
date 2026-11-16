import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { vehicles, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    // Read session
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    // Filter by organization if not Superadmin or if explicitly requested
    const orgFilter = searchParams.get("organizationId") || (session?.roleCode !== "SUPERADMIN" ? session?.organizationId : null);

    const vehicleList = await db.query.vehicles.findMany({
      where: orgFilter ? eq(vehicles.organizationId, orgFilter) : undefined,
      with: {
        fuelType: true,
        location: true,
        assignedDriver: true,
      },
      orderBy: [desc(vehicles.createdAt)],
    });

    const filtered = search
      ? vehicleList.filter(
          (v) =>
            v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            v.brandModel.toLowerCase().includes(search.toLowerCase())
        )
      : vehicleList;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data aset armada berhasil diambil",
      data: {
        items: items.map((v) => ({
          id: v.id,
          name: `${v.brandModel} (${v.plateNumber})`,
          type: v.vehicleType || "Truk Kargo",
          fuelType: v.fuelType?.name || "Bio Solar (B35)",
          serialNumber: v.plateNumber,
          power: `${v.year || 2022} - Euro 4`,
          location: v.location?.name || "Pool Utama",
          fuelConsumption: "3.2 km/L",
          status: v.status === "operational" ? "Aktif" : "Maintenance",
          notes: `Driver: ${v.assignedDriver?.name || "Belum ditugaskan"}`,
          organizationId: v.organizationId,
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

    const newVeh = {
      id: `veh_${Date.now()}`,
      organizationId: targetOrgId,
      plateNumber: body.serialNumber || body.plateNumber || `B ${Math.floor(1000 + Math.random() * 9000)} FC`,
      brandModel: body.name || "Hino Ranger",
      vehicleType: body.type || "Heavy Truck",
      fuelTypeId: body.fuelTypeId || "fuel_solar",
      assignedDriverId: body.assignedDriverId || null,
      locationId: body.locationId || "loc_pool_cikarang",
      year: body.year ? parseInt(body.year, 10) : 2023,
      status: body.status || "operational",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(vehicles).values(newVeh);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Aset armada berhasil ditambahkan",
      data: newVeh,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
