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
    const categoryParam = searchParams.get("category"); // "vehicle" | "equipment" | "all"
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

    const isStationary = (t: string) => {
      const lower = (t || "").toLowerCase();
      return (
        lower.includes("excavator") ||
        lower.includes("genset") ||
        lower.includes("generator") ||
        lower.includes("forklift") ||
        lower.includes("crane") ||
        lower.includes("pompa") ||
        lower.includes("compressor") ||
        lower.includes("loader") ||
        lower.includes("stasioner") ||
        lower.includes("alat berat") ||
        lower.includes("heavy equipment")
      );
    };

    const vehicleCount = vehicleList.filter((v) => !isStationary(v.vehicleType)).length;
    const equipmentCount = vehicleList.filter((v) => isStationary(v.vehicleType)).length;

    let categoryFiltered = vehicleList;
    if (categoryParam === "vehicle") {
      categoryFiltered = vehicleList.filter((v) => !isStationary(v.vehicleType));
    } else if (categoryParam === "equipment") {
      categoryFiltered = vehicleList.filter((v) => isStationary(v.vehicleType));
    }

    const filtered = search
      ? categoryFiltered.filter(
          (v) =>
            v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            v.brandModel.toLowerCase().includes(search.toLowerCase()) ||
            v.vehicleType.toLowerCase().includes(search.toLowerCase())
        )
      : categoryFiltered;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data aset armada berhasil diambil",
      data: {
        items: items.map((v) => {
          const stationary = isStationary(v.vehicleType);
          const isElectric = v.fuelType?.category === "electricity";
          const consumption = isElectric
            ? stationary
              ? "45 kWh/Jam"
              : "4.8 km/kWh"
            : stationary
            ? "18.5 L/Jam"
            : "3.2 km/L";

          return {
            id: v.id,
            name: `${v.brandModel} (${v.plateNumber})`,
            brandModel: v.brandModel,
            plateNumber: v.plateNumber,
            type: v.vehicleType || "Truk Kargo",
            category: stationary ? "equipment" : "vehicle",
            fuelType: v.fuelType?.name || "Bio Solar (B35)",
            fuelCategory: v.fuelType?.category || "diesel",
            serialNumber: v.plateNumber,
            power: stationary ? `${v.year || 150} kVA/kW` : `${v.year || 2023} - Standar Emisi`,
            location: v.location?.name || "Pool Utama",
            fuelConsumption: consumption,
            status: v.status === "operational" ? "Aktif" : "Maintenance",
            notes: v.assignedDriver?.name ? `Driver: ${v.assignedDriver.name}` : stationary ? "Alat Operasional Site" : "Belum ditugaskan",
            organizationId: v.organizationId,
          };
        }),
        count: filtered.length,
        counts: {
          all: vehicleList.length,
          vehicle: vehicleCount,
          equipment: equipmentCount,
        },
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

    const plateNumber = (body.plateNumber || body.serialNumber || `B ${Math.floor(1000 + Math.random() * 9000)} FC`).trim().toUpperCase();

    // Check duplicate
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.plateNumber, plateNumber),
    });
    if (existing) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: `Nomor Plat / Seri "${plateNumber}" sudah terdaftar.` },
        { status: 400 }
      );
    }

    const newVeh = {
      id: `veh_${Date.now()}`,
      organizationId: targetOrgId,
      plateNumber,
      brandModel: (body.brandModel || body.name || "Kendaraan Operasional").trim(),
      vehicleType: (body.vehicleType || body.type || "Heavy Truck").trim(),
      fuelTypeId: body.fuelTypeId || "fuel_solar",
      assignedDriverId: body.assignedDriverId || null,
      locationId: body.locationId || null,
      year: body.year ? parseInt(body.year, 10) : new Date().getFullYear(),
      status: body.status === "Aktif" ? "operational" : body.status === "Maintenance" ? "maintenance" : (body.status || "operational"),
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(vehicles).values(newVeh);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Aset armada & operasional berhasil ditambahkan",
      data: newVeh,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
