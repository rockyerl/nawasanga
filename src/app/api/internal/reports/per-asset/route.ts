import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { fuelLogs, vehicles, locations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "rank";
    const direction = searchParams.get("direction") || "asc";

    const allVehicles = await db.query.vehicles.findMany({
      with: {
        location: true,
        fuelType: true,
      },
    });

    const allLogs = await db.query.fuelLogs.findMany({
      orderBy: [desc(fuelLogs.loggedAt)],
    });

    const totalFleetEmissionsKg = allLogs.reduce((acc, l) => acc + l.emissionCo2Kg, 0) || 1;

    // Group logs by vehicle
    const vehicleStats = allVehicles.map((v) => {
      const vLogs = allLogs.filter((l) => l.vehicleId === v.id);
      const totalFuel = vLogs.reduce((acc, l) => acc + l.liters, 0);
      const totalEmissionsKg = vLogs.reduce((acc, l) => acc + l.emissionCo2Kg, 0);
      const totalEmissionsTon = parseFloat((totalEmissionsKg / 1000).toFixed(2));
      const percentage = Math.round((totalEmissionsKg / totalFleetEmissionsKg) * 100);

      // Estimate efficiency (km/L)
      const odometers = vLogs.map((l) => l.odometerKm).filter((o): o is number => o !== null);
      let efficiency = 8.5;
      if (odometers.length >= 2) {
        const minOdo = Math.min(...odometers);
        const maxOdo = Math.max(...odometers);
        const distance = maxOdo - minOdo;
        if (distance > 0 && totalFuel > 0) {
          efficiency = parseFloat((distance / totalFuel).toFixed(1));
        }
      } else if (v.vehicleType === "Heavy Truck") {
        efficiency = 3.5;
      } else if (v.vehicleType === "Medium Truck") {
        efficiency = 6.2;
      } else if (v.vehicleType === "Light Vehicle") {
        efficiency = 10.4;
      } else {
        efficiency = 5.0;
      }

      let status: "Baik" | "Perlu Perhatian" | "Kritis" = "Baik";
      if (efficiency < 4.0 && v.vehicleType !== "Heavy Truck") {
        status = "Kritis";
      } else if (efficiency < 5.5) {
        status = "Perlu Perhatian";
      }

      return {
        id: v.id,
        name: `${v.brandModel} (${v.plateNumber})`,
        location: v.location?.name || "Pool Utama",
        totalEmissions: totalEmissionsTon,
        totalFuel: Math.round(totalFuel),
        efficiency,
        status,
        percentage,
      };
    });

    // Sort by emissions descending to assign ranks
    vehicleStats.sort((a, b) => b.totalEmissions - a.totalEmissions);
    const rankedAssets = vehicleStats.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    // Apply search filter
    const filtered = search
      ? rankedAssets.filter(
          (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.location.toLowerCase().includes(search.toLowerCase())
        )
      : rankedAssets;

    // Apply user sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] ?? null;
      const bVal = b[sortBy as keyof typeof b] ?? null;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      if (direction === "desc") return aVal > bVal ? -1 : 1;
      return aVal > bVal ? 1 : -1;
    });

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data emisi per aset armada berhasil diambil dari database",
      data: {
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
