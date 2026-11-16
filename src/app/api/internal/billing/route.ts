import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, subscriptions, billingInvoices } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "client" | "global" (default: global)
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "all";
    const orgFilter = searchParams.get("organizationId") || "all";
    const company = searchParams.get("companyName");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    // If client portal requests specific company billing info
    if (type === "client" || (company && type !== "global")) {
      const org = company
        ? await db.query.organizations.findFirst({
            where: eq(organizations.name, company),
            with: {
              subscriptions: true,
              invoices: true,
              vehicles: true,
            },
          })
        : await db.query.organizations.findFirst({
            with: {
              subscriptions: true,
              invoices: true,
              vehicles: true,
            },
          });

      const activeSub = org?.subscriptions?.[0];
      const invoices = (org?.invoices || []).map((inv) => ({
        id: inv.invoiceNumber,
        invoiceId: inv.id,
        date: new Date(inv.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        amount: `Rp ${inv.amountIdr.toLocaleString("id-ID")}`,
        rawAmount: inv.amountIdr,
        status: inv.status as "paid" | "pending" | "failed",
        paymentMethod: inv.paymentMethod || "Bank Transfer",
        paidAt: inv.paidAt ? new Date(inv.paidAt).toISOString() : null,
      }));

      const clientBillingData = {
        currentPlan: (org?.plan || "pro") as "trial" | "starter" | "pro" | "enterprise",
        companyName: org?.name || "Organisasi Klien",
        startedAt: activeSub ? new Date(activeSub.startsAt).toISOString().split("T")[0] : "2026-01-01",
        expiresAt: activeSub ? new Date(activeSub.expiresAt).toISOString().split("T")[0] : "2026-12-31",
        assetUsed: org?.vehicles?.length || 1,
        assetLimit: org?.maxAssets || 30,
        invoices,
      };

      return NextResponse.json({
        code: 200,
        status: "OK",
        message: "Data billing klien berhasil diambil",
        data: clientBillingData,
      });
    }

    // Default: Global Platform Billing (Internal Superadmin Backoffice)
    const allInvoices = await db.query.billingInvoices.findMany({
      with: {
        organization: true,
      },
      orderBy: [desc(billingInvoices.createdAt)],
    });

    // Real Global Metrics Calculation
    let totalRevenue = 0;
    let pendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    for (const inv of allInvoices) {
      if (inv.status === "paid") {
        totalRevenue += inv.amountIdr;
        paidCount++;
      } else if (inv.status === "pending") {
        pendingAmount += inv.amountIdr;
        pendingCount++;
      }
    }

    const totalInvoices = allInvoices.length;
    const collectionRate = totalInvoices > 0 ? Math.round((paidCount / totalInvoices) * 100) : 100;

    // Filter by search, status, and organization
    const filtered = allInvoices.filter((inv) => {
      const matchSearch =
        search === "" ||
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.organization?.name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchOrg = orgFilter === "all" || inv.organizationId === orgFilter;

      return matchSearch && matchStatus && matchOrg;
    });

    const start = (page - 1) * itemPerPage;
    const paginatedItems = filtered.slice(start, start + itemPerPage);

    const formattedItems = paginatedItems.map((inv) => {
      const subtotal = Math.round(inv.amountIdr / 1.11);
      const tax = inv.amountIdr - subtotal;

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        organizationId: inv.organizationId,
        companyName: inv.organization?.name || "Organisasi Tanpa Nama",
        industry: inv.organization?.industry || "Logistics",
        plan: inv.organization?.plan || "pro",
        amountIdr: inv.amountIdr,
        amountFormatted: `Rp ${inv.amountIdr.toLocaleString("id-ID")}`,
        subtotalFormatted: `Rp ${subtotal.toLocaleString("id-ID")}`,
        taxFormatted: `Rp ${tax.toLocaleString("id-ID")}`,
        status: inv.status,
        paymentMethod: inv.paymentMethod || "Bank Transfer BCA",
        paidAt: inv.paidAt ? new Date(inv.paidAt).toISOString() : null,
        createdAt: new Date(inv.createdAt).toISOString(),
        dueDate: new Date(new Date(inv.createdAt).getTime() + 14 * 86400000).toISOString(),
      };
    });

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data faktur dan billing global berhasil diambil",
      data: {
        metrics: {
          totalRevenue,
          totalRevenueFormatted: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
          pendingAmount,
          pendingAmountFormatted: `Rp ${pendingAmount.toLocaleString("id-ID")}`,
          totalInvoices,
          paidCount,
          pendingCount,
          collectionRate,
        },
        items: formattedItems,
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
    const { organizationId, amountIdr, paymentMethod, status } = body;

    if (!organizationId) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Organisasi wajib dipilih." },
        { status: 400 }
      );
    }

    if (!amountIdr || Number(amountIdr) <= 0) {
      return NextResponse.json(
        { code: 400, status: "Bad Request", message: "Nominal faktur valid wajib diisi." },
        { status: 400 }
      );
    }

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });

    if (!org) {
      return NextResponse.json(
        { code: 404, status: "Not Found", message: "Organisasi tidak ditemukan." },
        { status: 404 }
      );
    }

    const now = new Date();
    const allInvs = await db.select().from(billingInvoices);
    const invoiceNumber = `INV-2026-${String(allInvs.length + 1).padStart(3, "0")}`;
    const newInvoiceId = `inv_${Date.now()}`;

    const newInvoice = {
      id: newInvoiceId,
      organizationId,
      invoiceNumber,
      amountIdr: Number(amountIdr),
      status: status || "pending",
      paymentMethod: paymentMethod || "Bank Transfer BCA",
      paidAt: status === "paid" ? now : null,
      createdAt: now,
    };

    await db.insert(billingInvoices).values(newInvoice);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: `Faktur resmi "${invoiceNumber}" untuk "${org.name}" berhasil diterbitkan.`,
      data: newInvoice,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
