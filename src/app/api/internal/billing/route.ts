import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations, subscriptions, billingInvoices } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("companyName") || "PT Nusantara Logistik Makmur";

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.name, company),
      with: {
        subscriptions: true,
        invoices: true,
        vehicles: true,
      },
    }) || await db.query.organizations.findFirst({
      with: {
        subscriptions: true,
        invoices: true,
        vehicles: true,
      },
    });

    const activeSub = org?.subscriptions?.[0];
    const invoices = (org?.invoices || []).map((inv) => ({
      id: inv.invoiceNumber,
      date: new Date(inv.createdAt).toISOString().split("T")[0],
      amount: `Rp ${inv.amountIdr.toLocaleString("id-ID")}`,
      status: inv.status as "paid" | "pending" | "failed",
    }));

    const billingData = {
      currentPlan: (org?.plan || "pro") as "trial" | "starter" | "pro" | "enterprise",
      companyName: org?.name || company,
      startedAt: activeSub ? new Date(activeSub.startsAt).toISOString().split("T")[0] : "2026-01-01",
      expiresAt: activeSub ? new Date(activeSub.expiresAt).toISOString().split("T")[0] : "2026-12-31",
      assetUsed: org?.vehicles?.length || 1,
      assetLimit: org?.maxAssets || 30,
      invoices,
    };

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data billing berhasil diambil",
      data: billingData,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
