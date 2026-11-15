import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allTypes = await db.select().from(vehicleTypes).orderBy(desc(vehicleTypes.createdAt));
    const filtered = search
      ? allTypes.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
      : allTypes;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data jenis kendaraan berhasil diambil",
      data: {
        items,
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
    const newVT = {
      id: `vt_${Date.now()}`,
      category: body.category || "heavy_truck",
      name: body.name,
      defaultFuelTypeId: body.defaultFuelTypeId || "fuel_solar",
      consumptionKm: parseFloat(body.consumptionKm) || 0.5,
      gvwMinTon: body.gvwMinTon ? parseFloat(body.gvwMinTon) : null,
      description: body.description || "",
      createdAt: new Date(),
    };

    await db.insert(vehicleTypes).values(newVT);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Jenis kendaraan berhasil ditambahkan",
      data: newVT,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
