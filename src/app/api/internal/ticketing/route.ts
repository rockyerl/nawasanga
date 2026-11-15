import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const ticketList = await db.query.tickets.findMany({
      with: {
        organization: true,
        user: true,
      },
      orderBy: [desc(tickets.createdAt)],
    });

    const filtered = search
      ? ticketList.filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()))
      : ticketList;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data tiket bantuan berhasil diambil",
      data: {
        items: items.map((t) => ({
          id: t.id,
          organizationName: t.organization?.name || "PT Nusantara Logistik Makmur",
          customerName: t.user?.name || "Admin Operasional",
          reportType: t.priority === "high" ? "Kritis" : "Bantuan Teknis",
          reportDetail: `${t.subject} - ${t.description}`,
          attachmentUrl: "/docs/sample-log.pdf",
          status: t.status === "resolved" ? "selesai" : t.status === "in_progress" ? "on progress" : "baru",
          createdAt: new Date(t.createdAt).toISOString().split("T")[0],
        })),
        count: filtered.length,
        page,
        itemPerPage,
        totalPages: Math.max(1, Math.ceil(filtered.length / itemPerPage)),
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();
    const newTicket = {
      id: `tkt_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      userId: body.userId || "user_client_admin",
      subject: body.subject || body.reportType || "Permintaan Bantuan",
      description: body.description || body.reportDetail || "-",
      priority: body.priority || "medium",
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(tickets).values(newTicket);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Tiket bantuan berhasil diajukan",
      data: newTicket,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
