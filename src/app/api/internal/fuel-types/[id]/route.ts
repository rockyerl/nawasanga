import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await db
      .update(fuelTypes)
      .set({
        name: body.name,
        category: body.category,
        emissionFactorKgCo2PerLiter: body.emissionFactor !== undefined ? parseFloat(body.emissionFactor) : undefined,
        unitPriceIdr: body.unitPriceIdr !== undefined ? parseInt(body.unitPriceIdr, 10) : undefined,
      })
      .where(eq(fuelTypes.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data jenis BBM berhasil diperbarui",
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
    await db.delete(fuelTypes).where(eq(fuelTypes.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Jenis BBM berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
