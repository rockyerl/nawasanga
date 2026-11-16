"use client";

import { Layout } from "@/components/layouts/layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
    ChevronDown, Lock, Lightbulb, AlertTriangle,
    Sparkles, Download, FileText, Plus, TrendingUp, TrendingDown, Minus,
    ArrowRight, Truck,
} from "lucide-react";
import {
    trialStatCards, trialEmissionsData, trialTopEmitters,
    starterStatCards, starterEmissionsData, starterTopEmitters, starterAssetUsage,
    proStatCards, proEmissionsData, proTopEmitters, proInsights,
    enterpriseStatCards, enterpriseEmissionsData, enterpriseLocationBars,
    enterprisePerformanceCategories, enterpriseInsights,
    type PlanType, type StatCard, type TopEmitter, type InsightBox,
} from "@/features/dashboard/constants/dashboard.constants";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries";

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatCardGrid({ cards }: { cards: StatCard[] }) {
    return (
        <div className={`grid gap-3 ${cards.length === 5 ? "grid-cols-5" : "grid-cols-4"}`}>
            {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-lg border border-neutral-200 px-4 py-3 flex flex-col gap-1">
                    <span className="text-xs text-[#8E8E8E]">{card.label}</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-gray-800">{card.value}</span>
                        {card.unit && <span className="text-xs text-[#8E8E8E]">{card.unit}</span>}
                    </div>
                    {card.trend && (
                        <span className={`text-[10px] font-semibold ${card.trendUp ? "text-green-500" : "text-red-400"}`}>
              {card.trend} <span className="text-[#8E8E8E] font-normal">{card.comparison}</span>
            </span>
                    )}
                    <div className="mt-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: card.barWidth, backgroundColor: card.barColor }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TopEmitterList({ emitters }: { emitters: any[] }) {
    const list = emitters?.length > 0 ? emitters : [];
    return (
        <div className="flex flex-col gap-2">
            {list.map((e, i) => (
                <div key={e.id || e.name || i} className="flex items-center gap-2 text-xs">
                    <span className="text-[#8E8E8E] w-4">{i + 1}</span>
                    <span className="text-gray-700 w-28 truncate font-medium">{e.name}</span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-[#1D9E75]" style={{ width: `${Math.min(e.pct || 0, 100)}%` }} />
                    </div>
                    <span className="text-[#8E8E8E] w-12 text-right font-mono">{e.value}t</span>
                    <span className="text-[#8E8E8E] w-10 text-right font-mono">{e.pct}%</span>
                </div>
            ))}
        </div>
    );
}

function FleetQuickSummary({
    title = "Ringkasan Status Armada Operasional",
    total = "3 Unit",
    active = "3 Unit (100%)",
    emissionsPerUnit = "0.68 ton CO₂e",
    subtext = "Sesuai Batas Regulasi",
}: {
    title?: string;
    total?: string;
    active?: string;
    emissionsPerUnit?: string;
    subtext?: string;
}) {
    return (
        <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#1D6B5A]" />
                    <span className="text-sm font-semibold text-gray-800">{title}</span>
                </div>
                <Link
                    href="/assets"
                    className="text-xs text-[#1D6B5A] hover:underline font-medium flex items-center gap-1"
                >
                    Kelola Aset & Kendaraan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-[#F7F5EF] p-3 text-center border border-[#EDEAE0]">
                    <span className="text-[11px] text-[#7A7A72]">Total Armada Terdaftar</span>
                    <p className="text-xl font-bold text-[#1A1A18] mt-0.5">{total}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">{active} Aktif</span>
                </div>
                <div className="rounded-lg bg-[#F7F5EF] p-3 text-center border border-[#EDEAE0]">
                    <span className="text-[11px] text-[#7A7A72]">Rata-rata Emisi / Aset</span>
                    <p className="text-xl font-bold text-[#1D6B5A] mt-0.5">{emissionsPerUnit}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">{subtext}</span>
                </div>
                <div className="rounded-lg bg-[#F7F5EF] p-3 flex flex-col items-center justify-center border border-[#EDEAE0]">
                    <span className="text-[11px] text-[#7A7A72] mb-1">Manajemen Inventaris</span>
                    <Link
                        href="/assets"
                        className="text-xs bg-[#1D6B5A] text-white px-3 py-1.5 rounded font-medium hover:bg-[#1D6B5A]/90 transition-colors shadow-xs"
                    >
                        Buka Menu Aset →
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ box }: { box: InsightBox }) {
    const config = {
        info:    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100",  icon: <Lightbulb className="h-3.5 w-3.5 text-blue-500" /> },
        warning: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100", icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> },
        success: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100", icon: <Sparkles className="h-3.5 w-3.5 text-green-500" /> },
    }[box.type];
    return (
        <div className={`rounded-lg border ${config.bg} ${config.border} p-3 flex flex-col gap-1.5`}>
            <div className="flex items-center gap-1.5">
                {config.icon}
                <span className={`text-xs font-semibold ${config.text}`}>{box.title}</span>
            </div>
            <p className={`text-[10px] leading-relaxed ${config.text}`}>{box.body}</p>
            {box.linkLabel && (
                <span className="text-[10px] text-[#1D9E75] font-medium cursor-pointer hover:underline">
          {box.linkLabel} →
        </span>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg bg-white border border-neutral-200 shadow-md px-3 py-2">
            <p className="text-xs text-[#8E8E8E] mb-0.5">{label}</p>
            {payload.map((p: { name: string; value: number; color: string }) => (
                <p key={p.name} className="text-xs font-semibold" style={{ color: p.color }}>
                    {p.value} ton CO₂e
                </p>
            ))}
        </div>
    );
};

// ─── Dynamic Helpers ──────────────────────────────────────────────────────────

function getDynamicChartData(stats: any, fallbackData: any[]) {
    if (stats?.monthlyEmissions && stats.monthlyEmissions.length > 0) {
        return stats.monthlyEmissions.map((m: any) => ({
            day: m.bulan,
            value: m.emisi,
            genset: parseFloat((m.emisi * 0.28).toFixed(2)),
            alatBerat: parseFloat((m.emisi * 0.16).toFixed(2)),
            surabaya: parseFloat((m.emisi * 0.35).toFixed(2)),
            bali: parseFloat((m.emisi * 0.18).toFixed(2)),
            balikpapan: parseFloat((m.emisi * 0.12).toFixed(2)),
        }));
    }
    return fallbackData;
}

// ─── Plan: TRIAL ─────────────────────────────────────────────────────────────

function TrialDashboard({ stats }: { stats?: any }) {
    const [period, setPeriod] = useState("Bulanan");
    const cards = stats?.statCards?.length ? stats.statCards.slice(0, 4) : trialStatCards;
    const chartData = getDynamicChartData(stats, trialEmissionsData);
    const topEmitters = stats?.topEmitters?.length ? stats.topEmitters.slice(0, 2) : trialTopEmitters;
    const fleet = stats?.fleetSummary;

    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={cards} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart */}
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-800">Tren Emisi</span>
                        <button
                            onClick={() => setPeriod(period === "Bulanan" ? "Mingguan" : "Bulanan")}
                            className="flex items-center gap-1 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50"
                        >
                            {period} <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3, fill: "#1D9E75", stroke: "#fff", strokeWidth: 1.5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Emitter */}
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 block mb-3">Top Emitter (Top 2)</span>
                    <TopEmitterList emitters={topEmitters} />
                </div>
            </div>

            {/* Locked insight banner */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 flex items-center gap-3">
                <Lock className="h-4 w-4 text-[#8E8E8E] shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700">Insight Lanjutan</p>
                    <p className="text-[10px] text-[#8E8E8E]">Dapatkan analisis mendalam, deteksi anomali, dan rekomendasi penghematan.</p>
                </div>
                <Link href="/billing" className="text-xs bg-[#1D9E75] text-white rounded px-3 py-1.5 font-medium whitespace-nowrap hover:bg-[#0F6E56] transition-colors">
                    Upgrade ke Pro
                </Link>
            </div>

            {/* Fleet Status Summary */}
            <FleetQuickSummary
                title="Ringkasan Status Armada &amp; Operasional"
                total={fleet?.total || "3 Unit"}
                active={fleet?.active || "3 Unit (100%)"}
                emissionsPerUnit={fleet?.emissionsPerUnit || "0.68 ton CO₂e"}
                subtext={fleet?.subtext || "Sesuai Batas Regulasi"}
            />
        </div>
    );
}

// ─── Plan: STARTER ───────────────────────────────────────────────────────────

function StarterDashboard({ stats }: { stats?: any }) {
    const [period, setPeriod] = useState("Bulanan");
    const cards = stats?.statCards?.length ? stats.statCards.slice(0, 4) : starterStatCards;
    const chartData = getDynamicChartData(stats, starterEmissionsData);
    const topEmitters = stats?.topEmitters?.length ? stats.topEmitters : starterTopEmitters;
    const fleet = stats?.fleetSummary;

    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={cards} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-800">Tren Emisi</span>
                        <button
                            onClick={() => setPeriod(period === "Bulanan" ? "Mingguan" : "Bulanan")}
                            className="flex items-center gap-1 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50"
                        >
                            {period} <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value" stroke="#1D6B5A" strokeWidth={2} dot={{ r: 3, fill: "#1D6B5A", stroke: "#fff", strokeWidth: 1.5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 block mb-3">Top Emitter (Top 5)</span>
                    <TopEmitterList emitters={topEmitters} />
                </div>
            </div>

            {/* Penggunaan Asset + Insight + Efisiensi (locked) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-xs font-semibold text-gray-700 block mb-2">Penggunaan Asset</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-800">{stats?.assets?.length || starterAssetUsage.used}</span>
                        <span className="text-xs text-[#8E8E8E]">/ 10</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#1D6B5A]" style={{ width: `${Math.min(((stats?.assets?.length || starterAssetUsage.used) / 10) * 100, 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] mt-2">Upgrade ke Pro untuk kuota tanpa batas</p>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="h-3.5 w-3.5 text-[#1D9E75]" />
                        <span className="text-xs font-semibold text-gray-700">Insight Operasional</span>
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] leading-relaxed">
                        Emisi terkendali stabil di bawah target ESG kuartal ini.<br />
                        Konsumsi BBM armada utama terpantau efisien.
                    </p>
                    <Link href="/reports/trends" className="text-[10px] text-[#1D9E75] font-medium mt-2 block hover:underline">
                        Lihat Detail Tren →
                    </Link>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Lock className="h-3.5 w-3.5 text-[#8E8E8E]" />
                        <span className="text-xs font-semibold text-gray-700">Efisiensi Detail</span>
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] leading-relaxed">Lihat efisiensi per asset dan per kategori.</p>
                    <Link href="/billing" className="mt-3 inline-block text-[10px] bg-[#1D9E75] text-white rounded px-2.5 py-1 font-medium hover:bg-[#0F6E56] transition-colors">
                        Upgrade ke Pro
                    </Link>
                </div>
            </div>

            {/* Fleet Status Summary */}
            <FleetQuickSummary
                title="Ringkasan Status Armada &amp; Efisiensi Pool"
                total={fleet?.total || "8 / 10 Unit"}
                active={fleet?.active || "8 Unit (80%)"}
                emissionsPerUnit={fleet?.emissionsPerUnit || "1.28 ton CO₂e"}
                subtext={fleet?.subtext || "Efisiensi Normal"}
            />
        </div>
    );
}

// ─── Plan: PRO ───────────────────────────────────────────────────────────────

function ProDashboard({ stats }: { stats?: any }) {
    const [period, setPeriod] = useState("Bulanan");
    const cards = stats?.statCards?.length ? stats.statCards : proStatCards;
    const chartData = getDynamicChartData(stats, proEmissionsData);
    const topEmitters = stats?.topEmitters?.length ? stats.topEmitters : proTopEmitters;
    const fleet = stats?.fleetSummary;

    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={cards} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-800">Tren Emisi per Kategori</span>
                        <button
                            onClick={() => setPeriod(period === "Bulanan" ? "Mingguan" : "Bulanan")}
                            className="flex items-center gap-1 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50"
                        >
                            {period} <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-2">
                        {[
                            { label: "Kendaraan", color: "#1D6B5A" },
                            { label: "Genset",    color: "#2A9478" },
                            { label: "Alat Berat",color: "#B8962E" },
                        ].map((l) => (
                            <span key={l.label} className="flex items-center gap-1 text-[10px] text-[#8E8E8E]">
                                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                                {l.label}
                            </span>
                        ))}
                    </div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value"     name="Kendaraan" stroke="#1D6B5A" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="genset"    name="Genset"    stroke="#2A9478" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="alatBerat" name="Alat Berat"stroke="#B8962E" strokeWidth={1.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 block mb-3">Top Emitter (Peringkat Teratas)</span>
                    <TopEmitterList emitters={topEmitters} />
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proInsights.map((box) => (
                    <InsightCard key={box.title} box={box} />
                ))}
            </div>

            {/* Fleet Status Summary */}
            <FleetQuickSummary
                title="Status Komposisi Armada &amp; Dekarbonisasi"
                total={fleet?.total || "25 / 50 Unit"}
                active={fleet?.active || "21 Fleet + 4 Mesin"}
                emissionsPerUnit={fleet?.emissionsPerUnit || "1.45 ton CO₂e"}
                subtext={fleet?.subtext || "Sesuai Standar Regulasi Scope 1"}
            />
        </div>
    );
}

// ─── Plan: ENTERPRISE ────────────────────────────────────────────────────────

function EnterpriseDashboard({ stats }: { stats?: any }) {
    const [period, setPeriod] = useState("Bulanan");
    const cards = stats?.statCards?.length ? stats.statCards : enterpriseStatCards;
    const chartData = getDynamicChartData(stats, enterpriseEmissionsData);
    const topEmitters = stats?.topEmitters?.length ? stats.topEmitters : proTopEmitters;
    const fleet = stats?.fleetSummary;

    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={cards} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tren Emisi per Lokasi */}
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-800">Tren Emisi per Lokasi</span>
                        <button
                            onClick={() => setPeriod(period === "Bulanan" ? "Mingguan" : "Bulanan")}
                            className="flex items-center gap-1 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50"
                        >
                            {period} <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        {[
                            { label: "Jakarta", color: "#1D6B5A" }, { label: "Surabaya", color: "#2A9478" },
                            { label: "Bali",    color: "#B8962E" }, { label: "Balikpapan", color: "#C14B2A" },
                        ].map((l) => (
                            <span key={l.label} className="flex items-center gap-1 text-[10px] text-[#8E8E8E]">
                                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                                {l.label}
                            </span>
                        ))}
                    </div>
                    <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value"      name="Jakarta"    stroke="#1D6B5A" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="surabaya"   name="Surabaya"   stroke="#2A9478" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="bali"       name="Bali"       stroke="#B8962E" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="balikpapan" name="Balikpapan" stroke="#C14B2A" strokeWidth={1.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Perbandingan Lokasi */}
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-800">Perbandingan Lokasi</span>
                        <button className="flex items-center gap-1 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50">
                            Bulanan <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enterpriseLocationBars} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" vertical={false} />
                                <XAxis dataKey="city" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={28} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Emisi" fill="#1D9E75" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights + Performa + Warning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard box={enterpriseInsights[0]} />

                {/* Donut chart */}
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-xs font-semibold text-gray-700 block mb-3">Performa Kategori</span>
                    <div className="flex items-center gap-4">
                        <div className="h-[80px] w-[80px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={enterprisePerformanceCategories as any[]} dataKey="pct" cx="50%" cy="50%" innerRadius={25} outerRadius={38}>
                                        {enterprisePerformanceCategories.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-1">
                            {enterprisePerformanceCategories.map((c) => (
                                <div key={c.name} className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-1 text-[10px] text-[#8E8E8E]">
                                        <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c.color }} />
                                        {c.name}
                                    </span>
                                    <span className="text-[10px] font-semibold text-gray-700">{c.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <InsightCard box={enterpriseInsights[1]} />
            </div>

            {/* Fleet Status Summary */}
            <FleetQuickSummary
                title="Monitoring Distribusi Armada Multi-Site Nasional"
                total={fleet?.total || "120+ Unit"}
                active={fleet?.active || "4 Hub Wilayah"}
                emissionsPerUnit={fleet?.emissionsPerUnit || "1.12 ton CO₂e"}
                subtext={fleet?.subtext || "Audit ESG Terverifikasi"}
            />
        </div>
    );
}

// ─── Topbar helpers ───────────────────────────────────────────────────────────

function CommonTopbar({
    plan,
    organizationName,
}: {
    plan: PlanType;
    organizationName?: string;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">Executive Dashboard</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#1D6B5A]/10 text-[#1D6B5A]">
                        {plan} Tier
                    </span>
                </div>
                <p className="text-xs text-[#7A7A72] mt-0.5">
                    Monitoring Emisi Scope 1, Konsumsi Bahan Bakar &amp; ESG — <strong className="text-[#1A1A18]">{organizationName || "PT Nusantara Logistik Makmur"}</strong>
                </p>
            </div>
            <div className="flex items-center gap-2.5">
                {plan === "enterprise" && (
                    <>
                        <Link
                            href="/reports/summary"
                            className="flex items-center gap-1.5 text-xs text-[#7A7A72] border border-[#DEDAD0] bg-white rounded-lg px-2.5 py-1.5 hover:bg-neutral-50 transition-colors shadow-xs"
                        >
                            <Download className="h-3 w-3" /> Export
                        </Link>
                        <Link
                            href="/reports/audit"
                            className="flex items-center gap-1.5 text-xs text-[#7A7A72] border border-[#DEDAD0] bg-white rounded-lg px-2.5 py-1.5 hover:bg-neutral-50 transition-colors shadow-xs"
                        >
                            <FileText className="h-3 w-3" /> Laporan Audit
                        </Link>
                    </>
                )}
                <Link
                    href="/logs"
                    className="flex items-center gap-1.5 text-xs bg-[#1D6B5A] text-white rounded-lg px-3 py-1.5 hover:bg-[#155245] transition-colors font-medium shadow-xs"
                >
                    <Plus className="h-3.5 w-3.5" /> Catat Log BBM
                </Link>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PLAN_LABELS: { id: PlanType; label: string }[] = [
    { id: "trial",      label: "Trial" },
    { id: "starter",    label: "Starter" },
    { id: "pro",        label: "Pro" },
    { id: "enterprise", label: "Enterprise" },
];

export default function ClientDashboard() {
    const { data: statsRes } = useDashboardStats("client");
    const stats = (statsRes?.data as any) || null;

    const [plan, setPlan] = useState<PlanType>("pro");

    useEffect(() => {
        if (stats?.organization?.plan) {
            const p = stats.organization.plan.toLowerCase() as PlanType;
            if (["trial", "starter", "pro", "enterprise"].includes(p)) {
                setPlan(p);
            }
        }
    }, [stats?.organization?.plan]);

    const organizationName = stats?.organization?.name || "PT Nusantara Logistik Makmur";

    return (
        <Layout>
            {/* Plan switcher — Interactive Tier Preview */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-0">
                <span className="text-xs text-[#8E8E8E] mr-1">Tingkat Layanan:</span>
                {PLAN_LABELS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                            plan === p.id
                                ? "bg-[#1D6B5A] text-white border-transparent font-medium shadow-xs"
                                : "border-neutral-200 text-[#8E8E8E] hover:bg-neutral-50"
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
                <CommonTopbar plan={plan} organizationName={organizationName} />
                {plan === "trial"      && <TrialDashboard stats={stats} />}
                {plan === "starter"    && <StarterDashboard stats={stats} />}
                {plan === "pro"        && <ProDashboard stats={stats} />}
                {plan === "enterprise" && <EnterpriseDashboard stats={stats} />}
            </div>
        </Layout>
    );
}