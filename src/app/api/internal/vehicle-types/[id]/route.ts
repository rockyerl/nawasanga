import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await db
      .update(vehicleTypes)
      .set({
        name: body.name,
        category: body.category,
        defaultFuelTypeId: body.defaultFuelTypeId,
        consumptionKm: body.consumptionKm ? parseFloat(body.consumptionKm) : 0,
        gvwMinTon: body.gvwMinTon ? parseFloat(body.gvwMinTon) : null,
        description: body.description,
      })
      .where(eq(vehicleTypes.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Jenis kendaraan berhasil diperbarui",
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
    await db.delete(vehicleTypes).where(eq(vehicleTypes.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Jenis kendaraan berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
