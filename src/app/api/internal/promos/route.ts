import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { promos } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allPromos = await db.select().from(promos);
    const filtered = search
      ? allPromos.filter((p) => p.code.toLowerCase().includes(search.toLowerCase()))
      : allPromos;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data promo berhasil diambil",
      data: {
        items: items.map((p) => ({
          id: p.id,
          title: `Diskon Spesial ${p.discountPercent}% (${p.code})`,
          code: p.code,
          description: `Voucher potongan ${p.discountPercent}% untuk langganan fleet monitor.`,
          bannerUrl: "/images/promo-banner.jpg",
          discountType: "persen",
          discountValue: p.discountPercent,
          startDate: "2026-01-01",
          endDate: new Date(p.validUntil).toISOString().split("T")[0],
          status: p.isActive ? "aktif" : "non-aktif",
          isPushNotified: true,
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
    const newPromo = {
      id: `prm_${Date.now()}`,
      code: body.code.toUpperCase(),
      discountPercent: parseInt(body.discountValue || body.discountPercent, 10) || 10,
      maxDiscountIdr: 500000,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    };

    await db.insert(promos).values(newPromo);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Promo berhasil dibuat",
      data: newPromo,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
