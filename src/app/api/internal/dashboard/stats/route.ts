import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import {
  fuelLogs,
  vehicles,
  drivers,
  organizations,
  users,
  subscriptions,
  billingInvoices,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portal = searchParams.get("portal") || "client";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    // Filter by organization if not Superadmin or if explicitly requested, or when accessing client portal
    const orgFilter = searchParams.get("organizationId") || (session?.roleCode !== "SUPERADMIN" || portal === "client" ? session?.organizationId : null);

    const allVehicles = await db.query.vehicles.findMany({
      where: orgFilter ? eq(vehicles.organizationId, orgFilter) : undefined,
      with: {
        location: true,
        assignedDriver: true,
        fuelType: true,
      },
    });

    const allDrivers = await db.query.drivers.findMany({
      where: orgFilter ? eq(drivers.organizationId, orgFilter) : undefined,
    });
    const allLogs = await db.query.fuelLogs.findMany({
      where: orgFilter ? eq(fuelLogs.organizationId, orgFilter) : undefined,
      orderBy: [desc(fuelLogs.loggedAt)],
    });

    const totalFuelLiters = allLogs.reduce((acc, l) => acc + l.liters, 0);
    const totalEmissionsKg = allLogs.reduce((acc, l) => acc + l.emissionCo2Kg, 0);
    const totalCostIdr = allLogs.reduce((acc, l) => acc + l.costIdr, 0);
    const totalEmissionsTon = parseFloat((totalEmissionsKg / 1000).toFixed(2));

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const monthMap: Record<string, { emisi: number; konsumsi: number }> = {};
    for (let i = 0; i < 5; i++) {
      monthMap[months[i]] = { emisi: 0, konsumsi: 0 };
    }
    for (const l of allLogs) {
      const d = new Date(l.loggedAt);
      const mName = months[d.getMonth()];
      if (!monthMap[mName]) monthMap[mName] = { emisi: 0, konsumsi: 0 };
      monthMap[mName].emisi += l.emissionCo2Kg / 1000;
      monthMap[mName].konsumsi += l.liters;
    }

    const monthlyEmissions = Object.entries(monthMap).map(([bulan, v]) => ({
      bulan,
      emisi: parseFloat(v.emisi.toFixed(2)),
      konsumsi: Math.round(v.konsumsi),
    }));

    // Top Emitters
    const vehicleEmissionMap: Record<string, { name: string; kg: number; liters: number; odo: number[] }> = {};
    for (const v of allVehicles) {
      vehicleEmissionMap[v.id] = {
        name: `${v.brandModel} (${v.plateNumber})`,
        kg: 0,
        liters: 0,
        odo: [],
      };
    }
    for (const l of allLogs) {
      if (vehicleEmissionMap[l.vehicleId]) {
        vehicleEmissionMap[l.vehicleId].kg += l.emissionCo2Kg;
        vehicleEmissionMap[l.vehicleId].liters += l.liters;
        if (l.odometerKm) vehicleEmissionMap[l.vehicleId].odo.push(l.odometerKm);
      }
    }

    const vehicleEmissionList = Object.entries(vehicleEmissionMap)
      .map(([id, val]) => ({
        id,
        name: val.name,
        value: parseFloat((val.kg / 1000).toFixed(2)),
        liters: Math.round(val.liters),
        pct: Math.round((val.kg / (totalEmissionsKg || 1)) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    const topEmitters = vehicleEmissionList.slice(0, 5);

    // Asset rows
    const assets = allVehicles.map((v) => {
      const st = vehicleEmissionMap[v.id] || { kg: 0, liters: 0, odo: [] };
      const emisi = parseFloat((st.kg / 1000).toFixed(2));
      const konsumsi = Math.round(st.liters);
      const efisiensi = v.vehicleType === "Light Vehicle" ? 10.4 : v.vehicleType === "Heavy Truck" ? 3.5 : 6.2;
      return {
        id: v.id,
        name: `${v.brandModel} (${v.plateNumber})`,
        location: v.location?.name || "Pool Utama",
        kategori: v.vehicleType,
        konsumsi,
        emisi,
        efisiensi,
        trend: emisi > 0.4 ? ("up" as const) : ("down" as const),
        status: v.status === "operational" ? "Aktif" : "Perawatan",
      };
    });

    if (portal === "internal") {
      const allOrgs = await db.query.organizations.findMany();
      const allUsers = await db.query.users.findMany();
      const allSubs = await db.query.subscriptions.findMany({
        with: {
          organization: true,
        },
      });
      const allInvoices = await db.query.billingInvoices.findMany({
        orderBy: [desc(billingInvoices.createdAt)],
      });

      const totalRevenueIdr = allInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((acc, inv) => acc + inv.amountIdr, 0);

      // Plan distribution
      const planCount: Record<string, number> = { starter: 0, pro: 0, enterprise: 0, freemium: 0 };
      for (const org of allOrgs) {
        const p = org.plan.toLowerCase();
        if (p.includes("trial") || p.includes("free")) planCount.freemium += 1;
        else if (p.includes("pro")) planCount.pro += 1;
        else if (p.includes("enterprise")) planCount.enterprise += 1;
        else planCount.starter += 1;
      }

      const totalPlans = allOrgs.length || 1;
      const planDistribution = [
        { name: "Starter", value: planCount.starter, color: "#3B82F6", pct: `${Math.round((planCount.starter / totalPlans) * 100)}%` },
        { name: "Pro", value: planCount.pro, color: "#1D6B5A", pct: `${Math.round((planCount.pro / totalPlans) * 100)}%` },
        { name: "Enterprise", value: planCount.enterprise, color: "#B8962E", pct: `${Math.round((planCount.enterprise / totalPlans) * 100)}%` },
        { name: "Freemium", value: planCount.freemium, color: "#7A7A72", pct: `${Math.round((planCount.freemium / totalPlans) * 100)}%` },
      ];

      return NextResponse.json({
        code: 200,
        status: "OK",
        message: "Data statistik superadmin internal berhasil diambil dari database",
        data: {
          statCards: [
            { label: "Total Emisi Terpantau", value: `${totalEmissionsTon}`, unit: "ton CO₂e", trend: "-4,2%", trendUp: true, comparison: "vs bulan lalu", barWidth: "68%", barColor: "#1D9E75" },
            { label: "Perusahaan Terdaftar", value: `${allOrgs.length}`, unit: "perusahaan", trend: "+12%", trendUp: true, comparison: "vs bulan lalu", barWidth: "75%", barColor: "#3B82F6" },
            { label: "Total Pendapatan", value: `Rp ${(totalRevenueIdr / 1000000).toFixed(1)}Jt`, unit: "IDR", trend: "+18%", trendUp: true, comparison: "vs bulan lalu", barWidth: "82%", barColor: "#B8962E" },
            { label: "Total Pengguna Aktif", value: `${allUsers.length}`, unit: "user", trend: "+5%", trendUp: true, comparison: "vs bulan lalu", barWidth: "60%", barColor: "#1D6B5A" },
          ],
          monthlyEmissions,
          planDistribution,
          recentKyc: allOrgs.map((org) => ({
            id: org.id,
            companyName: org.name,
            tier: org.plan,
            submittedAt: new Date(org.createdAt).toLocaleDateString("id-ID"),
            status: org.status === "pending_kyc" ? "pending" : "approved",
            reviewer: "Admin Verifikator",
          })),
          recentSubscriptions: allSubs.map((s) => ({
            id: s.id,
            companyName: (s as any).organization?.name || "Perusahaan Pelanggan",
            plan: s.plan,
            billingCycle: s.billingCycle,
            amount: s.priceIdr,
            renewalDate: new Date(s.expiresAt).toLocaleDateString("id-ID"),
            status: s.status,
          })),
        },
      });
    }

    // Client Dashboard stats
    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data statistik dashboard client berhasil diambil dari database",
      data: {
        statCards: [
          { label: "Total Emisi Karbon", value: `${totalEmissionsTon}`, unit: "ton CO₂e", trend: "-3,8%", trendUp: true, comparison: "vs bulan lalu", barWidth: "65%", barColor: "#1D9E75" },
          { label: "Konsumsi BBM", value: `${totalFuelLiters.toLocaleString("id-ID")}`, unit: "Liter", trend: "+1,2%", trendUp: false, comparison: "vs bulan lalu", barWidth: "55%", barColor: "#3B82F6" },
          { label: "Total Biaya BBM", value: `Rp ${(totalCostIdr / 1000000).toFixed(1)}M`, unit: "IDR", trend: "-2,1%", trendUp: true, comparison: "vs bulan lalu", barWidth: "60%", barColor: "#B8962E" },
          { label: "Armada Operasional", value: `${allVehicles.length}`, unit: "unit", trend: "100%", trendUp: true, comparison: "armada aktif", barWidth: "100%", barColor: "#1D6B5A" },
        ],
        monthlyEmissions,
        topEmitters,
        assets,
        insights: [
          {
            type: "anomaly",
            title: "Peringatan Konsumsi BBM Truk Tronton",
            description: "Hino Ranger 500 (B 9876 PQR) mencatat kenaikan konsumsi 14% di atas baseline.",
          },
          {
            type: "recommendation",
            title: "Optimasi Jadwal Pengisian Tangki Cikarang",
            description: "Pengisian terpusat di Pool Cikarang menghemat rata-rata 4.2% biaya pembelian BBM bulanan.",
          },
        ],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, status: "Error", message: String(err) },
      { status: 500 }
    );
  }
}
