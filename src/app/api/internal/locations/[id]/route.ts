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

    const updateData: Partial<typeof locations.$inferInsert> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = (body.type || "pool").toLowerCase();
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.province !== undefined) updateData.province = body.province;
    if (body.pic !== undefined) updateData.pic = body.pic;
    if (body.picPhone !== undefined) updateData.picPhone = body.picPhone;
    if (body.latitude !== undefined) updateData.latitude = typeof body.latitude === "number" ? body.latitude : parseFloat(body.latitude) || 0;
    if (body.longitude !== undefined) updateData.longitude = typeof body.longitude === "number" ? body.longitude : parseFloat(body.longitude) || 0;
    if (body.status !== undefined) updateData.isActive = body.status === "Tidak Aktif" ? false : true;

    await db.update(locations).set(updateData).where(eq(locations.id, id));

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
