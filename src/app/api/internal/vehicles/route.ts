import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const vehicleList = await db.query.vehicles.findMany({
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
    const newVeh = {
      id: `veh_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      plateNumber: body.serialNumber || body.plateNumber || `B ${Math.floor(1000 + Math.random() * 9000)} FC`,
      brandModel: body.name || "Hino Ranger",
      vehicleType: body.type || "Heavy Truck",
      fuelTypeId: body.fuelTypeId || "fuel_solar",
      assignedDriverId: body.assignedDriverId || null,
      locationId: body.locationId || "loc_pool_cikarang",
      year: 2023,
      status: "operational",
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
