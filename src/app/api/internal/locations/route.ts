import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allLocations = await db.select().from(locations).orderBy(desc(locations.id));
    const filtered = search
      ? allLocations.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
      : allLocations;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data lokasi berhasil diambil",
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
    const newLoc = {
      id: `loc_${Date.now()}`,
      organizationId: body.organizationId || "org_nusantara_logistik",
      name: body.name,
      type: body.type || "pool",
      address: body.address || "",
      latitude: parseFloat(body.latitude) || 0,
      longitude: parseFloat(body.longitude) || 0,
      isActive: true,
    };
    await db.insert(locations).values(newLoc);
    return NextResponse.json({ code: 201, status: "Created", message: "Lokasi berhasil ditambahkan", data: newLoc });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
