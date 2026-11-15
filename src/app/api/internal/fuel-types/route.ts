import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelTypes } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const allFuels = await db.select().from(fuelTypes);
    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data master bahan bakar berhasil diambil",
      data: allFuels,
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
