"use client";

import { Layout } from "@/components/layouts/layout";
import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  ChevronDown, TrendingUp, TrendingDown, Calendar,
  Download,
} from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries";

export default function InternalDashboard() {
  const { data: statsRes, isLoading } = useDashboardStats("internal");
  const stats = statsRes?.data;

  const statCards = useMemo(() => {
    return (
      stats?.statCards || [
        { label: "Total Emisi Terpantau", value: "3.2 ton", trend: "-4,2%", trendUp: true, comparison: "vs bulan lalu" },
        { label: "Perusahaan Terdaftar", value: "1 perusahaan", trend: "+12%", trendUp: true, comparison: "vs bulan lalu" },
        { label: "Total Pendapatan", value: "Rp 4.5Jt", trend: "+18%", trendUp: true, comparison: "vs bulan lalu" },
        { label: "Total Pengguna Aktif", value: "2 user", trend: "+5%", trendUp: true, comparison: "vs bulan lalu" },
      ]
    );
  }, [stats]);

  const emissionsData = useMemo(() => {
    if (stats?.monthlyEmissions && stats.monthlyEmissions.length > 0) {
      return stats.monthlyEmissions.map((m: any) => ({
        day: m.bulan,
        value: m.emisi,
      }));
    }
    return [
      { day: "Jan", value: 0.8 },
      { day: "Feb", value: 1.1 },
      { day: "Mar", value: 0.9 },
      { day: "Apr", value: 1.3 },
      { day: "Mei", value: 1.2 },
    ];
  }, [stats]);

  const planDist = useMemo(() => {
    return (
      stats?.planDistribution || [
        { name: "Starter", value: 1, color: "#3B82F6", pct: "25%" },
        { name: "Pro", value: 2, color: "#1D6B5A", pct: "50%" },
        { name: "Enterprise", value: 1, color: "#B8962E", pct: "25%" },
        { name: "Freemium", value: 0, color: "#7A7A72", pct: "0%" },
      ]
    );
  }, [stats]);

  return (
    <Layout>
      <div className="p-6 flex flex-col gap-6" style={{ backgroundColor: "#F7F5EF", minHeight: "100vh" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#1A1A18" }}>
              Super Admin Dashboard
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#7A7A72" }}>
              Nawasanga Carbon Operations · Database Live
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-white border border-[#DEDAD0] text-[#1A1A18]">
              <Calendar className="h-3.5 w-3.5 text-[#7A7A72]" />
              Mei 2026
              <ChevronDown className="h-3 w-3 text-[#7A7A72]" />
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-[#1D6B5A] text-[#F7F5EF]">
              <Download className="h-3.5 w-3.5" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card: any) => (
            <div key={card.label} className="rounded-xl p-4 flex flex-col gap-2 bg-white border border-[#DEDAD0]">
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] font-medium text-[#7A7A72]">{card.label}</span>
                {card.trend && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: card.trendUp ? "#eef5f3" : "#FEE2E2",
                      color: card.trendUp ? "#1D6B5A" : "#DC2626",
                    }}
                  >
                    {card.trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {card.trend}
                  </span>
                )}
              </div>
              <span className="text-xl font-bold text-[#1A1A18]">{card.value}</span>
            </div>
          ))}
        </div>

        {/* Charts & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl p-5 flex flex-col gap-4 bg-white border border-[#DEDAD0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1A1A18]">Platform Emission Overview</p>
                <p className="text-[11px] text-[#7A7A72]">Total emisi tercatat di database lintas tenant (ton CO₂e)</p>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emissionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7A7A72" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#7A7A72" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1D6B5A" strokeWidth={2.5} dot={{ r: 4, fill: "#1D6B5A" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl p-5 flex flex-col gap-4 bg-white border border-[#DEDAD0]">
            <p className="text-sm font-semibold text-[#1A1A18]">Subscription Plan Distribution</p>
            <div className="flex flex-col items-center justify-around h-full gap-4">
              <div className="relative" style={{ height: 160, width: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planDist} innerRadius="70%" outerRadius="100%" paddingAngle={5} dataKey="value">
                      {planDist.map((entry: any, i: number) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 w-full px-2">
                {planDist.map((p: any) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-[12px] font-medium text-[#7A7A72]">{p.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A18]">{p.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Quick Telemetry & Feature Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tenant Verification Executive Summary */}
          <div className="rounded-xl p-5 flex flex-col justify-between bg-white border border-[#DEDAD0]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1D6B5A]">
                  Tenant Governance
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eef5f3] text-[#1D6B5A]">
                  {stats?.recentKyc?.length || 0} Terdaftar
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1A1A18]">
                Verifikasi & Status Organisasi Tenant
              </h3>
              <p className="text-xs text-[#7A7A72] mt-1">
                Kelola pendaftaran organisasi perusahaan, status KYC, penanggung jawab (PIC), dan penetapan batas armada kendaraan.
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-lg bg-[#F7F5EF] p-3 text-center border border-[#EDEAE0]">
                  <span className="text-[11px] text-[#7A7A72]">Aktif & Terverifikasi</span>
                  <p className="text-lg font-bold text-[#1D6B5A] mt-0.5">
                    {stats?.recentKyc?.filter((k: any) => k.status === "approved").length || 1} Organisasi
                  </p>
                </div>
                <div className="rounded-lg bg-[#FEF9EC] p-3 text-center border border-[#E8DEC0]">
                  <span className="text-[11px] text-[#B8962E]">Menunggu Review</span>
                  <p className="text-lg font-bold text-[#B8962E] mt-0.5">
                    {stats?.recentKyc?.filter((k: any) => k.status === "pending").length || 0} Permohonan
                  </p>
                </div>
                <div className="rounded-lg bg-[#F7F5EF] p-3 text-center border border-[#EDEAE0]">
                  <span className="text-[11px] text-[#7A7A72]">Total Akun PIC</span>
                  <p className="text-lg font-bold text-[#1A1A18] mt-0.5">
                    {stats?.statCards?.[3]?.value || "2 User"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0EDE5] flex items-center justify-between">
              <span className="text-xs text-[#7A7A72]">
                Akses terpusat verifikasi KYC dan legalitas perusahaan
              </span>
              <a
                href="/admin/organization"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#1D6B5A] text-[#F7F5EF] hover:bg-[#155245] transition-colors"
              >
                Kelola Organisasi & Verifikasi &rarr;
              </a>
            </div>
          </div>

          {/* Operational & Platform Governance Navigation */}
          <div className="rounded-xl p-5 flex flex-col justify-between bg-white border border-[#DEDAD0]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8962E]">
                  Platform Control
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF9EC] text-[#B8962E]">
                  SLA 99.9%
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1A1A18]">
                Pusat Kendali Operasional & ESG
              </h3>
              <p className="text-xs text-[#7A7A72] mt-1">
                Akses cepat modul konfigurasi faktor emisi IPCC, helpdesk tiket customer, paket langganan, dan faktur billing platform.
              </p>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <a
                  href="/admin/billing"
                  className="p-3 rounded-lg border border-[#EDEAE0] bg-[#FDFCFA] hover:bg-[#F7F5EF] transition-colors flex flex-col"
                >
                  <span className="text-xs font-bold text-[#1A1A18]">Faktur & Billing Global</span>
                  <span className="text-[11px] text-[#7A7A72] mt-0.5">Tagihan & pendapatan platform</span>
                </a>
                <a
                  href="/admin/fuel-type"
                  className="p-3 rounded-lg border border-[#EDEAE0] bg-[#FDFCFA] hover:bg-[#F7F5EF] transition-colors flex flex-col"
                >
                  <span className="text-xs font-bold text-[#1A1A18]">Faktor Emisi BBM (IPCC)</span>
                  <span className="text-[11px] text-[#7A7A72] mt-0.5">Koefisien standar emisi karbon</span>
                </a>
                <a
                  href="/admin/ticketing"
                  className="p-3 rounded-lg border border-[#EDEAE0] bg-[#FDFCFA] hover:bg-[#F7F5EF] transition-colors flex flex-col"
                >
                  <span className="text-xs font-bold text-[#1A1A18]">Helpdesk & Tiket Global</span>
                  <span className="text-[11px] text-[#7A7A72] mt-0.5">Layanan bantuan tenant klien</span>
                </a>
                <a
                  href="/admin/subscription"
                  className="p-3 rounded-lg border border-[#EDEAE0] bg-[#FDFCFA] hover:bg-[#F7F5EF] transition-colors flex flex-col"
                >
                  <span className="text-xs font-bold text-[#1A1A18]">Master Paket Langganan</span>
                  <span className="text-[11px] text-[#7A7A72] mt-0.5">Batas aset & skema harga paket</span>
                </a>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0EDE5] flex items-center justify-between">
              <span className="text-xs text-[#7A7A72]">
                Sistem RBAC dan audit log aktif
              </span>
              <a
                href="/admin/users"
                className="text-xs font-semibold text-[#1D6B5A] hover:underline"
              >
                Kelola User Administrator &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
