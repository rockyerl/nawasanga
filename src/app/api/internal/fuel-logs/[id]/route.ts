import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, fuelTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const log = await db.query.fuelLogs.findFirst({
      where: eq(fuelLogs.id, id),
      with: {
        vehicle: true,
        driver: true,
        fuelType: true,
      },
    });

    if (!log) {
      return NextResponse.json({ code: 404, status: "Not Found", message: "Log BBM tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ code: 200, status: "OK", data: log });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.query.fuelLogs.findFirst({
      where: eq(fuelLogs.id, id),
    });
    if (!existing) {
      return NextResponse.json({ code: 404, status: "Not Found", message: "Log BBM tidak ditemukan" }, { status: 404 });
    }

    const liters = body.liters !== undefined ? parseFloat(body.liters) || existing.liters : existing.liters;
    const fuelTypeId = body.fuelTypeId || existing.fuelTypeId;

    const fuel = await db.query.fuelTypes.findFirst({
      where: eq(fuelTypes.id, fuelTypeId),
    });

    const emissionFactor = fuel?.emissionFactorKgCo2PerLiter || 2.68;
    const unitPrice = fuel?.unitPriceIdr || 6800;

    const emissionCo2Kg = parseFloat((liters * emissionFactor).toFixed(2));
    const costIdr = Math.round(liters * unitPrice);

    const updateData: Partial<typeof fuelLogs.$inferInsert> = {
      vehicleId: body.vehicleId || existing.vehicleId,
      driverId: body.driverId !== undefined ? body.driverId : existing.driverId,
      fuelTypeId,
      liters,
      costIdr,
      emissionCo2Kg,
      odometerKm: body.odometerKm !== undefined ? parseInt(body.odometerKm, 10) : existing.odometerKm,
      fuelStation: body.fuelStation !== undefined ? body.fuelStation : existing.fuelStation,
    };

    await db.update(fuelLogs).set(updateData).where(eq(fuelLogs.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data log konsumsi BBM berhasil diperbarui",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(fuelLogs).where(eq(fuelLogs.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Log BBM berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
