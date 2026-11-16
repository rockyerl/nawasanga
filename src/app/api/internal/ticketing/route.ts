import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tickets, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    // Read session to see if we should restrict by organization
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const orgFilter = searchParams.get("organizationId") || (session?.roleCode !== "SUPERADMIN" ? session?.organizationId : null);

    const ticketList = await db.query.tickets.findMany({
      with: {
        organization: true,
        user: true,
      },
      orderBy: [desc(tickets.createdAt)],
    });

    let filtered = orgFilter
      ? ticketList.filter((t) => t.organizationId === orgFilter)
      : ticketList;

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          t.organization?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data tiket bantuan berhasil diambil",
      data: {
        items: items.map((t) => ({
          id: t.id,
          organizationName: t.organization?.name || "PT Sinergi Logistik Nusantara",
          customerName: t.user?.name || "Penanggung Jawab Klien",
          reportType: t.subject || "Permintaan Dukungan Teknis",
          reportDetail: t.description || "-",
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

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    let targetOrgId = body.organizationId || session?.organizationId;

    if (!targetOrgId && body.organizationName) {
      const matchedOrg = await db.query.organizations.findFirst({
        where: eq(organizations.name, body.organizationName.trim()),
      });
      if (matchedOrg) {
        targetOrgId = matchedOrg.id;
      }
    }

    if (!targetOrgId) {
      const firstOrg = await db.query.organizations.findFirst();
      targetOrgId = firstOrg?.id || "org_nusantara_logistik";
    }

    const newTicket = {
      id: `tkt_${Date.now()}`,
      organizationId: targetOrgId,
      userId: session?.userId || "user_client_admin",
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
      message: "Tiket bantuan berhasil diajukan.",
      data: newTicket,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
