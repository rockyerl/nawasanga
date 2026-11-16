import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Partial<typeof vehicles.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (body.plateNumber !== undefined) updateData.plateNumber = body.plateNumber.trim().toUpperCase();
    if (body.brandModel !== undefined || body.name !== undefined) updateData.brandModel = (body.brandModel || body.name).trim();
    if (body.vehicleType !== undefined || body.type !== undefined) updateData.vehicleType = (body.vehicleType || body.type).trim();
    if (body.fuelTypeId !== undefined) updateData.fuelTypeId = body.fuelTypeId;
    if (body.assignedDriverId !== undefined) updateData.assignedDriverId = body.assignedDriverId || null;
    if (body.locationId !== undefined) updateData.locationId = body.locationId || null;
    if (body.year !== undefined) updateData.year = parseInt(body.year, 10) || 2023;
    if (body.status !== undefined) updateData.status = body.status === "Aktif" ? "operational" : body.status === "Maintenance" ? "maintenance" : (body.status || "operational");

    await db.update(vehicles).set(updateData).where(eq(vehicles.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data aset berhasil diperbarui",
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
    await db.delete(vehicles).where(eq(vehicles.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Aset armada berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
