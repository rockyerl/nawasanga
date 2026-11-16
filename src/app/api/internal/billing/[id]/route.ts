import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { billingInvoices, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inv = await db.query.billingInvoices.findFirst({
      where: eq(billingInvoices.id, id),
      with: {
        organization: true,
      },
    });

    if (!inv) {
      return NextResponse.json(
        { code: 404, status: "Not Found", message: "Faktur tidak ditemukan." },
        { status: 404 }
      );
    }

    const subtotal = Math.round(inv.amountIdr / 1.11);
    const tax = inv.amountIdr - subtotal;

    return NextResponse.json({
      code: 200,
      status: "OK",
      data: {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        organizationId: inv.organizationId,
        companyName: inv.organization?.name || "Organisasi Klien",
        companyAddress: inv.organization?.address || "Kawasan Industri, Indonesia",
        companyNpwp: "01.234.567.8-901.000",
        contactEmail: inv.organization?.contactEmail,
        contactPhone: inv.organization?.contactPhone,
        plan: inv.organization?.plan || "pro",
        amountIdr: inv.amountIdr,
        amountFormatted: `Rp ${inv.amountIdr.toLocaleString("id-ID")}`,
        subtotalFormatted: `Rp ${subtotal.toLocaleString("id-ID")}`,
        taxFormatted: `Rp ${tax.toLocaleString("id-ID")}`,
        status: inv.status,
        paymentMethod: inv.paymentMethod || "Bank Transfer BCA",
        createdAt: new Date(inv.createdAt).toISOString(),
        paidAt: inv.paidAt ? new Date(inv.paidAt).toISOString() : null,
        dueDate: new Date(new Date(inv.createdAt).getTime() + 14 * 86400000).toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentMethod } = body;

    const inv = await db.query.billingInvoices.findFirst({
      where: eq(billingInvoices.id, id),
    });

    if (!inv) {
      return NextResponse.json(
        { code: 404, status: "Not Found", message: "Faktur tidak ditemukan." },
        { status: 404 }
      );
    }

    const now = new Date();
    await db
      .update(billingInvoices)
      .set({
        status: status || inv.status,
        paymentMethod: paymentMethod || inv.paymentMethod,
        paidAt: status === "paid" ? now : inv.paidAt,
      })
      .where(eq(billingInvoices.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: `Status faktur "${inv.invoiceNumber}" berhasil diperbarui menjadi "${status}".`,
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
    await db.delete(billingInvoices).where(eq(billingInvoices.id, id));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Faktur berhasil dihapus.",
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
