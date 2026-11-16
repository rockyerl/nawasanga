import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await db
      .update(organizations)
      .set({
        name: body.name,
        industry: body.industry,
        contactEmail: body.contactEmail || body.personInCharge,
        contactPhone: body.contactPhone,
        address: body.address,
        city: body.city,
        province: body.province,
        latitude: body.latitude != null ? Number(body.latitude) : undefined,
        longitude: body.longitude != null ? Number(body.longitude) : undefined,
        plan: body.plan,
        maxAssets: body.maxAssets !== undefined ? parseInt(body.maxAssets, 10) : undefined,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data organisasi berhasil diperbarui",
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
    await db.delete(organizations).where(eq(organizations.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Organisasi berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
