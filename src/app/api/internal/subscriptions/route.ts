import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { subscriptions, organizations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allSubs = await db.query.subscriptions.findMany({
      with: {
        organization: true,
      },
      orderBy: [desc(subscriptions.startsAt)],
    });

    const defaultPlans = [
      {
        id: "plan_trial",
        name: "Trial / Freemium",
        priceIdr: 0,
        maxAssets: 5,
        features: ["Monitoring Emisi Karbon Dasar", "Kalkulasi Scope 1 Manual", "Laporan Ringkasan Bulanan"],
      },
      {
        id: "plan_starter",
        name: "Starter",
        priceIdr: 1500000,
        maxAssets: 15,
        features: ["Pencatatan BBM & Struk SPBU", "Manajemen Driver & Lokasi Pool", "Faktor Emisi IPCC Terstandarisasi", "Export PDF Laporan"],
      },
      {
        id: "plan_pro",
        name: "Pro Enterprise",
        priceIdr: 4500000,
        maxAssets: 50,
        features: ["Semua Fitur Starter", "Multi-Pool & Depot", "Audit Jejak Emisi Scope 1 & 2", "API Integration Sensor GPS", "Prioritas Helpdesk 24/7"],
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
