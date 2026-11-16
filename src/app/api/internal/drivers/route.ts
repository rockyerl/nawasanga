import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { drivers, locations, vehicles, fuelLogs, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kycFilter = searchParams.get("kycStatus"); // verified, pending, rejected
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const orgFilter = searchParams.get("organizationId") || (session?.roleCode !== "SUPERADMIN" ? session?.organizationId : null);

    const [allDrivers, allLocations, allVehicles, allLogs] = await Promise.all([
      db.select().from(drivers)
        .where(orgFilter ? eq(drivers.organizationId, orgFilter) : undefined)
        .orderBy(desc(drivers.createdAt)),
      db.select().from(locations)
        .where(orgFilter ? eq(locations.organizationId, orgFilter) : undefined),
      db.select().from(vehicles)
        .where(orgFilter ? eq(vehicles.organizationId, orgFilter) : undefined),
      db.select({
        driverId: fuelLogs.driverId,
        liters: fuelLogs.liters,
        emissionCo2Kg: fuelLogs.emissionCo2Kg,
      }).from(fuelLogs)
        .where(orgFilter ? eq(fuelLogs.organizationId, orgFilter) : undefined),
    ]);

    const locationMap = new Map(allLocations.map((l) => [l.id, l.name]));
    const vehicleByDriverMap = new Map<string, string>();
    allVehicles.forEach((v) => {
      if (v.assignedDriverId) {
        vehicleByDriverMap.set(v.assignedDriverId, v.plateNumber);
      }
    });

    const driverStatsMap = new Map<string, { count: number; liters: number; co2: number }>();
    allLogs.forEach((l) => {
      if (l.driverId) {
        const curr = driverStatsMap.get(l.driverId) || { count: 0, liters: 0, co2: 0 };
        curr.count += 1;
        curr.liters += l.liters;
        curr.co2 += l.emissionCo2Kg;
        driverStatsMap.set(l.driverId, curr);
      }
    });

    let filtered = allDrivers;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.licenseNumber.toLowerCase().includes(q) ||
          (d.nik && d.nik.includes(q))
      );
    }

    if (kycFilter && kycFilter !== "all") {
      filtered = filtered.filter((d) => (d.kycStatus || "verified") === kycFilter);
    }

    const now = Date.now();
    const ninetyDays = 90 * 24 * 3600 * 1000;

    const summary = {
      total: allDrivers.length,
      active: allDrivers.filter((d) => d.status === "active").length,
      verifiedKyc: allDrivers.filter((d) => (d.kycStatus || "verified") === "verified").length,
      pendingKyc: allDrivers.filter((d) => d.kycStatus === "pending").length,
      expiringSoon: allDrivers.filter((d) => {
        if (!d.licenseExpiry) return false;
        const expTime = new Date(d.licenseExpiry).getTime();
        return expTime > now && expTime <= now + ninetyDays;
      }).length,
    };

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data driver berhasil diambil",
      summary,
      data: {
        items: items.map((d) => {
          const logStats = driverStatsMap.get(d.id) || { count: 0, liters: 0, co2: 0 };
          const defaultExpiry = new Date(new Date(d.createdAt).getTime() + 365 * 24 * 3600 * 1000 * 3).toISOString().split("T")[0];

          return {
            id: d.id,
            name: d.name,
            nik: d.nik || "3201" + Math.floor(100000000000 + Math.random() * 900000000000),
            employeeId: d.id.replace("drv_", "EMP-").toUpperCase(),
            licenseType: d.licenseType || "SIM B2",
            licenseNumber: d.licenseNumber,
            licenseExpiry: d.licenseExpiry || defaultExpiry,
            phone: d.phoneNumber,
            phoneNumber: d.phoneNumber,
            locationId: d.locationId || "",
            locationName: d.locationId && locationMap.get(d.locationId) ? locationMap.get(d.locationId)! : "Pool Cikarang Logistik",
            status: d.status === "active" ? "Aktif" : "Tidak Aktif",
            kycStatus: d.kycStatus || "verified",
            notes: d.notes || "",
            avatarUrl: d.avatarUrl || null,
            assignedVehiclePlate: vehicleByDriverMap.get(d.id) || null,
            fuelLogCount: logStats.count,
            totalLiters: Math.round(logStats.liters * 10) / 10,
            totalCo2Kg: Math.round(logStats.co2 * 10) / 10,
            organizationId: d.organizationId,
            createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          };
        }),
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
    const now = new Date();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    let targetOrgId = body.organizationId || session?.organizationId;
    if (!targetOrgId) {
      const defaultOrg = await db.query.organizations.findFirst();
      targetOrgId = defaultOrg?.id || "org_nusantara_logistik";
    }

    const newDriver = {
      id: `drv_${Date.now()}`,
      organizationId: targetOrgId,
      name: body.name.trim(),
      licenseNumber: body.licenseNumber.trim(),
      phoneNumber: (body.phoneNumber || body.phone || "-").trim(),
      status: body.status === "Tidak Aktif" ? "inactive" : "active",
      licenseType: body.licenseType || "SIM B2",
      licenseExpiry: body.licenseExpiry || new Date(now.getTime() + 365 * 24 * 3600 * 1000 * 3).toISOString().split("T")[0],
      nik: body.nik?.trim() || null,
      kycStatus: body.kycStatus || "verified",
      locationId: body.locationId || null,
      notes: body.notes?.trim() || null,
      avatarUrl: body.avatarUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(drivers).values(newDriver);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Driver berhasil ditambahkan",
      data: newDriver,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
