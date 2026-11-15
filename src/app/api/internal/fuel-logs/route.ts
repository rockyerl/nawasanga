import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, fuelTypes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const logs = await db.query.fuelLogs.findMany({
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
          pictureUrl: l.receiptImageUrl || "/images/receipt-placeholder.png",
          notes: `${l.liters} L • ${l.emissionCo2Kg} kg CO₂ • Rp ${l.costIdr.toLocaleString("id-ID")}`,
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
    const fuel = await db.query.fuelTypes.findFirst({
      where: eq(fuelTypes.id, body.fuelTypeId || "fuel_solar"),
    });

    const liters = parseFloat(body.liters) || 0;
    const emissionFactor = fuel?.emissionFactorKgCo2PerLiter || 2.68;
    const emissionCo2Kg = parseFloat((liters * emissionFactor).toFixed(2));
    const unitPrice = fuel?.unitPriceIdr || 6800;
    const costIdr = parseInt(body.totalCostIdr || body.costIdr, 10) || Math.round(liters * unitPrice);

    const now = new Date();
    const newLog = {
      id: `flog_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      vehicleId: body.vehicleId || "veh_demo_1",
      driverId: body.driverId || "drv_demo_1",
      fuelTypeId: body.fuelTypeId || "fuel_solar",
      liters,
      emissionCo2Kg,
      costIdr,
      odometerKm: parseInt(body.odometerKm, 10) || null,
      fuelStation: body.fuelStation || `SPBU Pertamina Cikarang`,
      receiptImageUrl: body.receiptImageUrl || null,
      loggedAt: now,
      createdAt: now,
    };

    await db.insert(fuelLogs).values(newLog);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Pencatatan konsumsi BBM dan emisi CO2 berhasil disimpan",
      data: newLog,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
