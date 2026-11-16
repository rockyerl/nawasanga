import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, fuelTypes, organizations, vehicles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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

    const logs = await db.query.fuelLogs.findMany({
      where: orgFilter ? eq(fuelLogs.organizationId, orgFilter) : undefined,
      with: {
        vehicle: true,
        driver: true,
        fuelType: true,
      },
      orderBy: [desc(fuelLogs.loggedAt)],
    });

    const filtered = search
      ? logs.filter(
          (l) =>
            l.vehicle?.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            l.driver?.name.toLowerCase().includes(search.toLowerCase())
        )
      : logs;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data log konsumsi BBM berhasil diambil",
      data: {
        items: items.map((l) => ({
          id: l.id,
          createdAt: l.createdAt,
          updatedAt: l.createdAt,
          date: new Date(l.loggedAt).toLocaleDateString("id-ID"),
          time: new Date(l.loggedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          driverId: l.driverId || "-",
          driverName: l.driver?.name || "Driver Eksternal",
          vehicleId: l.vehicleId,
          vehicleName: l.vehicle?.plateNumber || "-",
          assetId: l.vehicleId,
          assetName: `${l.vehicle?.brandModel || "Armada"} (${l.fuelType?.name || "BBM"})`,
          lastOdometer: l.odometerKm || 45000,
          odometerKm: l.odometerKm || 45000,
          liters: l.liters,
          costIdr: l.costIdr,
          emissionCo2Kg: l.emissionCo2Kg,
          fuelStation: l.fuelStation || "SPBU Pertamina",
          fuelTypeName: l.fuelType?.name || "Bio Solar B35",
          fuelTypeId: l.fuelTypeId,
          receiptImageUrl: l.receiptImageUrl || "/images/receipt-placeholder.png",
          pictureUrl: l.receiptImageUrl || "/images/receipt-placeholder.png",
          notes: `${l.liters} L • ${l.emissionCo2Kg} kg CO₂ • Rp ${l.costIdr.toLocaleString("id-ID")}`,
          organizationId: l.organizationId,
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

    // 1. Resolve vehicle from database first
    const targetVehicleId = body.vehicleId || body.assetId;
    let targetVehicle = null;
    if (targetVehicleId) {
      targetVehicle = await db.query.vehicles.findFirst({
        where: eq(vehicles.id, targetVehicleId),
        with: { organization: true, fuelType: true, assignedDriver: true },
      });
    }

    // 2. Organization attribution is strictly anchored to the vehicle's registered organization!
    // This guarantees that unauthenticated drivers scanning a vehicle QR or selecting a fleet unit
    // will ALWAYS record transactions strictly under the vehicle's owning organization (PT A).
    let targetOrgId = targetVehicle?.organizationId || body.organizationId || session?.organizationId;
    if (!targetOrgId) {
      const defaultOrg = await db.query.organizations.findFirst();
      targetOrgId = defaultOrg?.id || "org_nusantara_logistik";
    }

    const liters = parseFloat(body.liters) || 50;

    // 3. Look up fuel type (from vehicle or body) for accurate IPCC emission factor and price
    const resolvedFuelTypeId = body.fuelTypeId || targetVehicle?.fuelTypeId || "fuel_solar";
    const fuel = await db.query.fuelTypes.findFirst({
      where: eq(fuelTypes.id, resolvedFuelTypeId),
    });

    const emissionFactor = fuel?.emissionFactorKgCo2PerLiter ?? 2.68;
    const unitPrice = fuel?.unitPriceIdr ?? 14500;
    const emissionCo2Kg = parseFloat((liters * emissionFactor).toFixed(2));
    const costIdr = parseInt(body.costIdr, 10) || Math.round(liters * unitPrice);

    // 4. Resolve driver (explicit driver, assigned vehicle driver, or null)
    const driverId = (body.driverId && body.driverId !== "none") 
      ? body.driverId 
      : targetVehicle?.assignedDriverId || null;

    const newLog = {
      id: `log_${Date.now()}`,
      organizationId: targetOrgId,
      vehicleId: targetVehicleId || "veh_demo_1",
      driverId,
      fuelTypeId: fuel?.id || resolvedFuelTypeId,
      liters,
      costIdr,
      odometerKm: body.odometerKm ? parseInt(body.odometerKm, 10) : null,
      emissionCo2Kg,
      fuelStation: body.fuelStation || body.fuelStationName || body.spbuName || body.notes || "SPBU Pertamina Terdekat",
      receiptImageUrl: body.receiptImageUrl || "/images/receipt-placeholder.png",
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : now,
      createdAt: now,
    };

    await db.insert(fuelLogs).values(newLog);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Log pengisian BBM berhasil dicatat.",
      data: {
        ...newLog,
        organizationName: targetVehicle?.organization?.name || "Perusahaan Terkait",
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
