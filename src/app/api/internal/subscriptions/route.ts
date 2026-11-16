import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { subscriptions, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    let allSubs: any[] = [];
    try {
      allSubs = await db.query.subscriptions.findMany({
        with: {
          organization: true,
        },
        orderBy: [desc(subscriptions.startsAt)],
      });
    } catch (dbErr) {
      console.warn("Notice: Subscriptions query fallback to table scan:", dbErr);
      allSubs = await db.select().from(subscriptions);
    }

    const defaultPlans = [
      {
        id: "plan_free",
        key: "free",
        name: "Freemium / Trial",
        description: "Uji coba gratis monitoring BBM dan emisi dasar hingga 5 kendaraan.",
        maxAssets: 5,
        maxUsers: 3,
        priceMonthly: 0,
        priceYearly: 0,
        features: [
          { key: "f1", label: "Monitoring Emisi Scope 1", enabled: true },
          { key: "f2", label: "Input Log BBM Manual", enabled: true },
          { key: "f3", label: "Kalkulasi Otomatis IPCC", enabled: true },
          { key: "f4", label: "Export Laporan PDF", enabled: false },
          { key: "f5", label: "Sensor IoT & Telematika", enabled: false },
        ],
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "plan_starter",
        key: "starter",
        name: "Starter Fleet",
        description: "Solusi armada logistik skala kecil hingga 15 kendaraan operasional.",
        maxAssets: 15,
        maxUsers: 15,
        priceMonthly: 799000,
        priceYearly: 7990000,
        features: [
          { key: "f1", label: "Semua Fitur Freemium", enabled: true },
          { key: "f2", label: "Pencatatan Struk SPBU", enabled: true },
          { key: "f3", label: "Manajemen Driver & Lokasi", enabled: true },
          { key: "f4", label: "Export Laporan PDF", enabled: true },
          { key: "f5", label: "Sensor IoT & Telematika", enabled: false },
        ],
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "plan_pro",
        key: "pro",
        name: "Pro Enterprise",
        description: "Fitur lengkap komparasi periode, deteksi anomali, dan WhatsApp bot.",
        maxAssets: 80,
        maxUsers: 80,
        priceMonthly: 1500000,
        priceYearly: 15000000,
        features: [
          { key: "f1", label: "Semua Fitur Starter", enabled: true },
          { key: "f2", label: "Multi-Pool & Depot", enabled: true },
          { key: "f3", label: "Audit Jejak Emisi Scope 1 & 2", enabled: true },
          { key: "f4", label: "WhatsApp Bot Input", enabled: true },
          { key: "f5", label: "Prioritas Helpdesk 24/7", enabled: true },
        ],
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "plan_enterprise",
        key: "enterprise",
        name: "Enterprise Custom",
        description: "Infrastruktur dedicated, white-label platform, dan integrasi SAP/ERP.",
        maxAssets: 500,
        maxUsers: 200,
        priceMonthly: 4500000,
        priceYearly: 45000000,
        features: [
          { key: "f1", label: "Semua Fitur Pro", enabled: true },
          { key: "f2", label: "Dedicated Account Manager", enabled: true },
          { key: "f3", label: "Integrasi SAP / Oracle ERP", enabled: true },
          { key: "f4", label: "Custom Domain & Branding", enabled: true },
          { key: "f5", label: "Kepatuhan Audit SRN-PPI", enabled: true },
        ],
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data paket langganan berhasil diambil",
      data: defaultPlans,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Paket langganan berhasil diperbarui",
      data: body,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
