"use client";

import { Layout } from "@/components/layouts/layout";
import { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
    ChevronDown, TrendingUp, TrendingDown, Calendar,
    Download, SlidersHorizontal, Zap, ArrowUpRight, AlertTriangle,
    Search
} from "lucide-react";

import {
    mockStatCards,
    mockEmissionsData,
    mockKycEntries,
    mockSubscriptions
} from "@/lib/mock-data/internal-dashboard.mock";
import { DashboardTypes } from "@/types/features/dashboard.type";

const PLAN_LABEL: Record<string, string> = {
    freemium: "Freemium",
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise"
};

const PLAN_COLOR: Record<string, { bg: string; text: string }> = {
    freemium:   { bg: "#EDEAE0", text: "#7A7A72" },
    starter:    { bg: "#DBEAFE", text: "#1D4ED8" },
    pro:        { bg: "#1D6B5A", text: "#F7F5EF" },
    enterprise: { bg: "#FEF9EC", text: "#B8962E" },
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
    active:    { bg: "#eef5f3", text: "#1D6B5A" },
    trial:     { bg: "#FEF3C7", text: "#B45309" },
    expired:   { bg: "#FEE2E2", text: "#B91C1C" },
    cancelled: { bg: "#EDEAE0", text: "#7A7A72" },
    pending:   { bg: "#FEF3C7", text: "#B45309" },
    approved:  { bg: "#eef5f3", text: "#1D6B5A" },
    rejected:  { bg: "#FEE2E2", text: "#B91C1C" },
};

function Badge({ bg, text, label }: { bg: string; text: string; label: string }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap uppercase tracking-wider"
              style={{ backgroundColor: bg, color: text }}>
            {label}
        </span>
    );
}

function Sparkline({ data, color, width = 90, height = 30 }: { data: number[]; color: string; width?: number; height?: number }) {
    const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const planDistribution = [
    { name: "Starter",    value: 52, color: "#3B82F6", pct: "43,3%" },
    { name: "Pro",        value: 32, color: "#1D6B5A", pct: "26,7%" },
    { name: "Enterprise", value: 8,  color: "#B8962E", pct: "6,7%"  },
    { name: "Freemium",   value: 28, color: "#7A7A72", pct: "23,3%" },
];

export default function InternalDashboard() {
    const [companySearch, setCompanySearch] = useState("");

    const filteredKyc = mockKycEntries.filter(c =>
        c.companyName.toLowerCase().includes(companySearch.toLowerCase())
    );

    return (
        <Layout>
            <div className="p-6 flex flex-col gap-6" style={{ backgroundColor: "#F7F5EF", minHeight: "100vh" }}>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-lg font-semibold" style={{ color: "#1A1A18" }}>Super Admin Dashboard</h1>
                        <p className="text-xs mt-0.5" style={{ color: "#7A7A72" }}>Nawasanga Organization · Mei 2026</p>
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

                <div className="grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                    {mockStatCards.map((card) => (
                        <div key={card.label} className="rounded-xl p-4 flex flex-col gap-2 bg-white border border-[#DEDAD0]">
                            <div className="flex items-start justify-between gap-1">
                                <span className="text-[11px] font-medium text-[#7A7A72]">{card.label}</span>
                                <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                      style={{
                                          backgroundColor: card.trendUp ? "#eef5f3" : "#FEE2E2",
                                          color: card.trendUp ? "#1D6B5A" : "#DC2626"
                                      }}>
                                    {card.trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                    {card.trend}
                                </span>
                            </div>
                            <span className="text-xl font-bold text-[#1A1A18]">{card.value}</span>
                            <div className="flex items-end justify-between mt-1">
                                <span className="text-[10px] text-[#BDBDB5]">{card.comparison}</span>
                                <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: card.barWidth, backgroundColor: card.barColor }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="rounded-xl p-5 flex flex-col gap-3 bg-white border border-[#DEDAD0]">
                        <div>
                            <p className="text-sm font-semibold text-[#1A1A18]">Emisi Log Trend</p>
                            <p className="text-[11px] mt-0.5 text-[#7A7A72]">Aktivitas pencatatan emisi harian</p>
                        </div>
                        <div style={{ height: "200px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockEmissionsData}>
                                    <CartesianGrid stroke="#F0EDE5" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#7A7A72" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "#7A7A72" }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="value" stroke="#1D6B5A" strokeWidth={2.5} dot={{ r: 4, fill: "#1D6B5A" }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-xl p-5 flex flex-col gap-4 bg-white border border-[#DEDAD0]">
                        <p className="text-sm font-semibold text-[#1A1A18]">Subscription Plan Distribution</p>
                        <div className="flex flex-row items-center justify-around h-full">
                            <div className="relative" style={{ height: 160, width: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={planDistribution} innerRadius="70%" outerRadius="100%" paddingAngle={5} dataKey="value">
                                            {planDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#1A1A18]">248</span>
                                    <span className="text-[10px] text-[#7A7A72]">Total Tenant</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {planDistribution.map((p) => (
                                    <div key={p.name} className="flex items-center gap-8">
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

                <div className="rounded-xl flex flex-col overflow-hidden bg-white border border-[#DEDAD0]">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE5]">
                        <div>
                            <p className="text-sm font-semibold text-[#1A1A18]">KYC Pending Review</p>
                            <p className="text-[11px] mt-0.5 text-[#7A7A72]">Pendaftaran tenant yang memerlukan verifikasi</p>
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
                                    <th key={h} className="px-5 py-3 text-[10px] font-bold text-[#7A7A72] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F7F5EF]">
                            {filteredKyc.map((kyc) => (
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
                                            label={PLAN_LABEL[kyc.plan]}
                                            bg={PLAN_COLOR[kyc.plan].bg}
                                            text={PLAN_COLOR[kyc.plan].text}
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-xs text-[#7A7A72]">{kyc.sector}</td>
                                    <td className="px-5 py-3 text-xs text-[#7A7A72]">{kyc.assetCount}</td>
                                    <td className="px-5 py-3">
                                        <Badge
                                            label={kyc.status}
                                            bg={STATUS_COLOR[kyc.status].bg}
                                            text={STATUS_COLOR[kyc.status].text}
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