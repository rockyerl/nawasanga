import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { promos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(promos).where(eq(promos.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Promo berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
