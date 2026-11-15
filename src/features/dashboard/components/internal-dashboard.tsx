"use client";

import { Layout } from "@/components/layouts/layout";
import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  ChevronDown, TrendingUp, TrendingDown, Calendar,
  Download, Search
} from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries";

const PLAN_LABEL: Record<string, string> = {
  freemium: "Freemium",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLAN_COLOR: Record<string, { bg: string; text: string }> = {
  freemium: { bg: "#EDEAE0", text: "#7A7A72" },
  starter: { bg: "#DBEAFE", text: "#1D4ED8" },
  pro: { bg: "#1D6B5A", text: "#F7F5EF" },
  enterprise: { bg: "#FEF9EC", text: "#B8962E" },
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  active: { bg: "#eef5f3", text: "#1D6B5A" },
  trial: { bg: "#FEF3C7", text: "#B45309" },
  expired: { bg: "#FEE2E2", text: "#B91C1C" },
  cancelled: { bg: "#EDEAE0", text: "#7A7A72" },
  pending: { bg: "#FEF3C7", text: "#B45309" },
  approved: { bg: "#eef5f3", text: "#1D6B5A" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C" },
};

function Badge({ bg, text, label }: { bg: string; text: string; label: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap uppercase tracking-wider"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}

export default function InternalDashboard() {
  const [companySearch, setCompanySearch] = useState("");
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

  const kycEntries = useMemo(() => {
    const raw = stats?.recentKyc || [];
    return raw.map((k: any) => ({
      id: k.id,
      companyName: k.companyName,
      picName: k.reviewer || "PIC Admin",
      email: "admin@fuelcarbon.id",
      plan: (k.tier || "pro").toLowerCase(),
      sector: "Logistics",
      assetCount: "6 unit",
      submittedAt: k.submittedAt,
      status: k.status || "approved",
    }));
  }, [stats]);

  const filteredKyc = useMemo(() => {
    return kycEntries.filter((c: any) =>
      c.companyName.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [kycEntries, companySearch]);

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

        {/* KYC Review Table */}
        <div className="rounded-xl flex flex-col overflow-hidden bg-white border border-[#DEDAD0]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE5]">
            <div>
              <p className="text-sm font-semibold text-[#1A1A18]">KYC & Tenant Verification</p>
              <p className="text-[11px] mt-0.5 text-[#7A7A72]">Pendaftaran tenant yang diverifikasi dalam database</p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A7A72]" />
              <input
                type="text"
                placeholder="Cari perusahaan..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F7F5EF] border border-[#DEDAD0] outline-none w-48"
                onChange={(e) => setCompanySearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFCFA] border-b border-[#F0EDE5]">
                  {["ID", "Company Name", "PIC", "Plan", "Sector", "Assets", "Status", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold text-[#7A7A72] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F5EF]">
                {filteredKyc.map((kyc: any) => (
                  <tr key={kyc.id} className="hover:bg-[#FDFCFA] transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-[#7A7A72]">{kyc.id}</td>
                    <td className="px-5 py-3 text-xs font-bold text-[#1A1A18]">{kyc.companyName}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#1A1A18]">{kyc.picName}</span>
                        <span className="text-[10px] text-[#7A7A72]">{kyc.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        label={PLAN_LABEL[kyc.plan] || kyc.plan}
                        bg={PLAN_COLOR[kyc.plan]?.bg || "#DBEAFE"}
                        text={PLAN_COLOR[kyc.plan]?.text || "#1D4ED8"}
                      />
                    </td>
                    <td className="px-5 py-3 text-xs text-[#7A7A72]">{kyc.sector}</td>
                    <td className="px-5 py-3 text-xs text-[#7A7A72]">{kyc.assetCount}</td>
                    <td className="px-5 py-3">
                      <Badge
                        label={kyc.status}
                        bg={STATUS_COLOR[kyc.status]?.bg || "#eef5f3"}
                        text={STATUS_COLOR[kyc.status]?.text || "#1D6B5A"}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-[11px] font-bold text-[#1D6B5A] hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
