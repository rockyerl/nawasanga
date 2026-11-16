import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { notifications, drivers, fuelLogs, billingInvoices, tickets, organizations } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const orgFilter = session?.roleCode !== "SUPERADMIN" ? session?.organizationId : null;

    // 1. Fetch DB notifications
    const dbNotifs = await db
      .select()
      .from(notifications)
      .where(orgFilter ? eq(notifications.organizationId, orgFilter) : undefined)
      .orderBy(desc(notifications.createdAt))
      .limit(30);

    // 2. Compute dynamic live alerts from real tables
    const [orgDrivers, orgLogs, orgInvoices, orgTickets] = await Promise.all([
      db.select().from(drivers).where(orgFilter ? eq(drivers.organizationId, orgFilter) : undefined),
      db.select().from(fuelLogs).where(orgFilter ? eq(fuelLogs.organizationId, orgFilter) : undefined).orderBy(desc(fuelLogs.loggedAt)).limit(50),
      db.select().from(billingInvoices).where(orgFilter ? eq(billingInvoices.organizationId, orgFilter) : undefined),
      db.select().from(tickets).where(orgFilter ? eq(tickets.organizationId, orgFilter) : undefined),
    ]);

    const generatedAlerts: Array<{
      id: string;
      title: string;
      message: string;
      type: "info" | "warning" | "success" | "error";
      category: "emission" | "operational" | "billing" | "system";
      link: string;
      isRead: boolean;
      createdAt: string;
    }> = [];

    const now = Date.now();
    const ninetyDays = 90 * 24 * 3600 * 1000;

    // Alert 1: Driver SIM Expiry or Pending KYC
    orgDrivers.forEach((d) => {
      if (d.licenseExpiry) {
        const expTime = new Date(d.licenseExpiry).getTime();
        if (expTime > now && expTime <= now + ninetyDays) {
          const daysLeft = Math.ceil((expTime - now) / (24 * 3600 * 1000));
          generatedAlerts.push({
            id: `alert_drv_exp_${d.id}`,
            title: "Masa Berlaku SIM Segera Berakhir",
            message: `SIM ${d.licenseType || "B2"} milik ${d.name} (${d.licenseNumber}) akan kadaluarsa dalam ${daysLeft} hari. Segera lakukan perpanjangan.`,
            type: "warning",
            category: "operational",
            link: "/drivers",
            isRead: false,
            createdAt: new Date(now - 3600 * 1000 * 2).toISOString(),
          });
        }
      }
      if (d.kycStatus === "pending") {
        generatedAlerts.push({
          id: `alert_drv_kyc_${d.id}`,
          title: "Verifikasi KYC Pengemudi Diperlukan",
          message: `Dokumen KYC pengemudi ${d.name} menunggu verifikasi tim operasional.`,
          type: "info",
          category: "operational",
          link: "/drivers",
          isRead: false,
          createdAt: new Date(now - 3600 * 1000 * 5).toISOString(),
        });
      }
    });

    // Alert 2: Emission / Fuel Log Volume Alert
    const highFuelLog = orgLogs.find((l) => l.liters >= 120);
    if (highFuelLog) {
      generatedAlerts.push({
        id: `alert_high_fuel_${highFuelLog.id}`,
        title: "Peringatan Konsumsi BBM Skala Besar",
        message: `Tercatat pengisian BBM ${highFuelLog.liters} L (${highFuelLog.emissionCo2Kg} kg CO₂e) pada armada ${highFuelLog.vehicleId}. Verifikasi kelayakan rute.`,
        type: "warning",
        category: "emission",
        link: "/logs",
        isRead: false,
        createdAt: new Date(highFuelLog.loggedAt).toISOString(),
      });
    }

    // Alert 3: Pending Billing Invoices
    const pendingInv = orgInvoices.find((i) => i.status === "pending");
    if (pendingInv) {
      generatedAlerts.push({
        id: `alert_inv_${pendingInv.id}`,
        title: "Menunggu Pembayaran Invoice",
        message: `Invoice tagihan langganan ${pendingInv.invoiceNumber} sebesar Rp ${pendingInv.amountIdr.toLocaleString("id-ID")} belum diselesaikan.`,
        type: "warning",
        category: "billing",
        link: "/billing",
        isRead: false,
        createdAt: new Date(pendingInv.createdAt).toISOString(),
      });
    }

    // Alert 4: Open Support Ticket
    const openTicket = orgTickets.find((t) => t.status === "open");
    if (openTicket) {
      generatedAlerts.push({
        id: `alert_tkt_${openTicket.id}`,
        title: "Tiket Bantuan Aktif",
        message: `Tiket "${openTicket.subject}" sedang menunggu respon dari tim teknis telematika Sundawa.`,
        type: "info",
        category: "system",
        link: "/support",
        isRead: false,
        createdAt: new Date(openTicket.createdAt).toISOString(),
      });
    }

    // Combine db notifications and dynamic alerts
    const mappedDbNotifs = dbNotifs.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type as "info" | "warning" | "success" | "error",
      category: n.category as "emission" | "operational" | "billing" | "system",
      link: n.link || "/dashboard",
      isRead: !!n.isRead,
      createdAt: new Date(n.createdAt).toISOString(),
    }));

    // Deduplicate by title
    const seenTitles = new Set<string>();
    const all = [...generatedAlerts, ...mappedDbNotifs].filter((item) => {
      if (seenTitles.has(item.title)) return false;
      seenTitles.add(item.title);
      return true;
    });

    const unreadCount = all.filter((n) => !n.isRead).length;

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data notifikasi berhasil diambil",
      data: {
        items: all,
        unreadCount,
        summary: {
          total: all.length,
          emission: all.filter((n) => n.category === "emission").length,
          operational: all.filter((n) => n.category === "operational").length,
          billing: all.filter((n) => n.category === "billing").length,
          system: all.filter((n) => n.category === "system").length,
        },
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    let targetOrgId = body.organizationId || session?.organizationId;
    if (!targetOrgId) {
      const defaultOrg = await db.query.organizations.findFirst();
      targetOrgId = defaultOrg?.id || "org_nusantara_logistik";
    }

    const newNotif = {
      id: `notif_${Date.now()}`,
      organizationId: targetOrgId,
      userId: session?.userId || null,
      title: body.title,
      message: body.message,
      type: body.type || "info",
      category: body.category || "system",
      link: body.link || null,
      isRead: false,
      createdAt: new Date(),
    };

    await db.insert(notifications).values(newNotif);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Notifikasi berhasil dibuat",
      data: newNotif,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.markAllAsRead) {
      const cookieStore = await cookies();
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      const session = token ? await verifySessionToken(token) : null;

      if (session?.organizationId) {
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.organizationId, session.organizationId));
      }
    } else if (body.id) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, body.id));
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Status notifikasi berhasil diperbarui",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
