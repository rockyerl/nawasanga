import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { drivers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Partial<typeof drivers.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.licenseNumber !== undefined) updateData.licenseNumber = body.licenseNumber.trim();
    if (body.phone !== undefined || body.phoneNumber !== undefined) {
      updateData.phoneNumber = (body.phone || body.phoneNumber).trim();
    }
    if (body.status !== undefined) {
      updateData.status = body.status === "Aktif" ? "active" : body.status === "Tidak Aktif" ? "inactive" : body.status;
    }

    await db.update(drivers).set(updateData).where(eq(drivers.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data pengemudi berhasil diperbarui",
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
    await db.delete(drivers).where(eq(drivers.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Driver berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
