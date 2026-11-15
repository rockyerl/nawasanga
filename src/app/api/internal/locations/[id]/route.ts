import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await db
      .update(locations)
      .set({
        name: body.name,
        type: body.type,
        address: body.address,
        latitude: body.latitude !== undefined ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude !== undefined ? parseFloat(body.longitude) : undefined,
      })
      .where(eq(locations.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data lokasi berhasil diperbarui",
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
    await db.delete(locations).where(eq(locations.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Lokasi berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
