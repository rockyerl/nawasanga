import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, vehicles, drivers, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);
    const requestedOrg = searchParams.get("organizationId");

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    let orgFilter: string | null = null;
    if (session && session.roleCode !== "SUPERADMIN") {
      orgFilter = session.organizationId || null;
    } else if (requestedOrg && requestedOrg !== "all") {
      orgFilter = requestedOrg;
    }

    const userOrg = orgFilter
      ? await db.query.organizations.findFirst({
          where: eq(organizations.id, orgFilter),
        })
      : await db.query.organizations.findFirst();

    if (!orgFilter && session?.roleCode !== "SUPERADMIN" && userOrg) {
      orgFilter = userOrg.id;
    }

    // Fetch logs with relations filtered by organization
    const allLogs = await db.query.fuelLogs.findMany({
      where: orgFilter ? eq(fuelLogs.organizationId, orgFilter) : undefined,
      with: {
        vehicle: true,
        driver: true,
      },
      orderBy: [desc(fuelLogs.loggedAt)],
    });

    // Group logs by month period
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const periodMap = new Map<string, {
      monthKey: string;
      period: string;
      totalFuel: number;
      totalEmissionsKg: number;
      vehicleIds: Set<string>;
      driverIds: Set<string>;
      timestamp: number;
    }>();

    for (const log of allLogs) {
      const d = new Date(log.loggedAt);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const period = `${months[mIdx]} ${yr}`;
      const monthKey = `${yr}-${String(mIdx + 1).padStart(2, "0")}`;

      if (!periodMap.has(period)) {
        periodMap.set(period, {
          monthKey,
          period,
          totalFuel: 0,
          totalEmissionsKg: 0,
          vehicleIds: new Set(),
          driverIds: new Set(),
          timestamp: new Date(yr, mIdx, 1).getTime(),
        });
      }

      const rec = periodMap.get(period)!;
      rec.totalFuel += log.liters;
      rec.totalEmissionsKg += log.emissionCo2Kg;
      if (log.vehicleId) rec.vehicleIds.add(log.vehicleId);
      if (log.driverId) rec.driverIds.add(log.driverId);
    }

    // Sort periods descending
    const sortedPeriods = Array.from(periodMap.values()).sort((a, b) => b.timestamp - a.timestamp);

    let idCounter = 1;
    const reports = sortedPeriods.map((p, idx) => {
      const totalVehicles = p.vehicleIds.size || 1;
      const totalDrivers = p.driverIds.size || 1;
      const totalEmissionsTon = parseFloat((p.totalEmissionsKg / 1000).toFixed(2));
      const avgEmissions = parseFloat((p.totalEmissionsKg / totalVehicles / 100).toFixed(1));

      return {
        id: `RPT-${String(idCounter++).padStart(4, "0")}`,
        period: p.period,
        totalFuel: Math.round(p.totalFuel * 10) / 10,
        totalEmissions: totalEmissionsTon,
        totalVehicles,
        totalDrivers,
        avgEmissions,
        status: idx === 0 ? ("Draft" as const) : ("Published" as const),
      };
    });

    const filtered = search
      ? reports.filter(
          (r) =>
            r.id.toLowerCase().includes(search.toLowerCase()) ||
            r.period.toLowerCase().includes(search.toLowerCase())
        )
      : reports;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data laporan ringkasan emisi berhasil diambil dari database",
      data: {
        organization: {
          id: userOrg?.id || "",
          name: userOrg?.name || "Organisasi Klien",
          plan: userOrg?.plan?.toLowerCase() || "pro",
        },
        items,
        count: filtered.length,
        page,
        itemPerPage,
        totalPages: Math.max(1, Math.ceil(filtered.length / itemPerPage)),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, status: "Error", message: String(err) },
      { status: 500 }
    );
  }
}
