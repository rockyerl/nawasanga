import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tickets, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingTicket = await db.query.tickets.findFirst({
      where: eq(tickets.id, id),
    });

    if (!existingTicket) {
      return NextResponse.json({ code: 404, status: "Not Found", message: "Tiket tidak ditemukan" }, { status: 404 });
    }

    const updateData: Partial<typeof tickets.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) {
      const s = body.status.toLowerCase();
      updateData.status = s === "selesai" || s === "resolved" ? "resolved" : s === "on progress" || s === "in_progress" ? "in_progress" : "open";
    }
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.description !== undefined) updateData.description = body.description;

    await db.update(tickets).set(updateData).where(eq(tickets.id, id));

    // Also trigger notification for client if status changed
    if (body.status && existingTicket.organizationId) {
      await db.insert(notifications).values({
        id: `notif_tkt_${Date.now()}`,
        organizationId: existingTicket.organizationId,
        title: `Pembaruan Tiket: ${existingTicket.subject}`,
        message: `Status tiket bantuan Anda telah diperbarui menjadi "${body.status}".`,
        type: "info",
        category: "system",
        link: "/support",
        isRead: false,
        createdAt: new Date(),
      }).catch(() => {});
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Status tiket berhasil diperbarui",
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
