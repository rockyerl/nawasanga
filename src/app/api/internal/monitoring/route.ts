import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const orgs = await db.query.organizations.findMany({
      with: {
        vehicles: true,
        fuelLogs: true,
        users: true,
      },
      orderBy: [desc(organizations.createdAt)],
    });

    const items = orgs.map((o) => ({
      id: o.id,
      organizationName: o.name,
      totalAssets: o.vehicles?.length || 0,
      lastLogin: new Date(o.updatedAt).toISOString().split("T")[0],
      totalEmissionLogs: o.fuelLogs?.length || 0,
      totalUsers: o.users?.length || 0,
      lastDataSync: new Date().toISOString().split("T")[0],
    }));

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data pemantauan sistem berhasil diambil",
      data: {
        items,
        count: items.length,
        page: 1,
        itemPerPage: 10,
        totalPages: 1,
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    code: 200,
    status: "OK",
    message: "Sinkronisasi database telematika selesai.",
  });
}
