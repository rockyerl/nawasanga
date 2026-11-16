import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Partial<typeof articles.$inferInsert> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt;
    if (body.status !== undefined) updateData.status = body.status;

    await db.update(articles).set(updateData).where(eq(articles.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Artikel berhasil diperbarui",
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
    await db.delete(articles).where(eq(articles.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Artikel berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
