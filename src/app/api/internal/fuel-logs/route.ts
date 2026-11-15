import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, fuelTypes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const logs = await db.query.fuelLogs.findMany({
      with: {
        vehicle: true,
        driver: true,
        fuelType: true,
      },
      orderBy: [desc(fuelLogs.loggedAt)],
    });

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data log konsumsi BBM berhasil diambil",
      data: logs,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fuel = await db.query.fuelTypes.findFirst({
      where: eq(fuelTypes.id, body.fuelTypeId),
    });

    const liters = parseFloat(body.liters) || 0;
    const emissionFactor = fuel?.emissionFactorKgCo2PerLiter || 2.68;
    const emissionCo2Kg = parseFloat((liters * emissionFactor).toFixed(2));
    const unitPrice = fuel?.unitPriceIdr || 10000;
    const costIdr = parseInt(body.totalCostIdr || body.costIdr, 10) || Math.round(liters * unitPrice);

    const now = new Date();
    const newLog = {
      id: `flog_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      vehicleId: body.vehicleId,
      driverId: body.driverId || null,
      fuelTypeId: body.fuelTypeId,
      liters,
      emissionCo2Kg,
      costIdr,
      odometerKm: parseInt(body.odometerKm, 10) || null,
      fuelStation: body.fuelStation || body.receiptNumber || `SPBU-${Date.now().toString().slice(-4)}`,
      receiptImageUrl: body.receiptImageUrl || null,
      loggedAt: now,
      createdAt: now,
    };

    await db.insert(fuelLogs).values(newLog);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Pencatatan konsumsi BBM dan kalkulasi emisi CO2 berhasil disimpan",
      data: newLog,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
