import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(tickets).where(eq(tickets.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Tiket bantuan berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
