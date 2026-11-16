import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const allFuels = await db.select().from(fuelTypes);
    const filtered = search
      ? allFuels.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
      : allFuels;

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data master bahan bakar berhasil diambil",
      data: {
        items: filtered.map((f) => ({
          id: f.id,
          code: f.id.replace("ft_", "").toUpperCase(),
          name: f.name,
          category: f.category,
          emissionFactor: f.emissionFactorKgCo2PerLiter,
          unitPriceIdr: f.unitPriceIdr,
          pricePerUnit: f.unitPriceIdr,
          unit: "liter",
          isActive: f.isActive,
          source: "IPCC 2006 / ESDM",
          updatedAt: new Date().toISOString(),
        })),
        count: filtered.length,
        page: 1,
        itemPerPage: 10,
        totalPages: 1,
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newFuel = {
      id: `fuel_${Date.now()}`,
      name: body.name,
      category: body.category || "diesel",
      emissionFactorKgCo2PerLiter: parseFloat(body.emissionFactor) || 2.68,
      unitPriceIdr: parseInt(body.unitPriceIdr, 10) || 10000,
      isActive: true,
    };
    await db.insert(fuelTypes).values(newFuel);
    return NextResponse.json({ code: 201, status: "Created", message: "Jenis BBM berhasil ditambahkan", data: newFuel });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
