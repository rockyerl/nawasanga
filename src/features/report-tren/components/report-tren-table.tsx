"use client";

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import { Lock, TrendingUp, TrendingDown } from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { DataGrid } from "@/components/data-grid";
import { trendColumns } from "@/features/report-tren/components/report-tren-columns";
import { ReportTrenTableToolbar } from "@/features/report-tren/components/report-tren-table-toolbar";
import { useTrends } from "@/features/report-tren/hooks/report-tren-user-queries";
import { exportToCsv } from "@/lib/export";
import type { PlanType } from "@/types/features/report-tren.type";

// ─── Plan config ──────────────────────────────────────────────────────────────

const PLAN_CONFIG: Record<PlanType, {
    badge: string;
    assetLabel: string;
    description: string;
    color: string;
    lightBg: string;
    border: string;
}> = {
    trial: {
        badge: "TRIAL PLAN",
        assetLabel: "3 Asset",
        description: "Fitur terbatas. Upgrade untuk melihat laporan tren lengkap.",
        color: "#7A7A72",
        lightBg: "#F7F5EF",
        border: "#EDEAE0",
    },
    starter: {
        badge: "STARTER PLAN",
        assetLabel: "10 Asset",
        description: "Tren emisi & konsumsi BBM untuk pantau performa perusahaan.",
        color: "#3B82F6",
        lightBg: "#EFF6FF",
        border: "#BFDBFE",
    },
    pro: {
        badge: "PRO PLAN",
        assetLabel: "30 Asset",
        description: "Perbandingan periode & insight otomatis untuk optimasi emisi.",
        color: "#1D6B5A",
        lightBg: "#EEF5F3",
        border: "#A2CFC5",
    },
    enterprise: {
        badge: "ENTERPRISE PLAN",
        assetLabel: "100+ Asset",
        description: "Tren multi-lokasi lengkap dengan benchmark & audit ready.",
        color: "#EF9F27",
        lightBg: "#FFFBF0",
        border: "#FDD9A0",
    },
};

// ─── Stat cards ───────────────────────────────────────────────────────────────

interface StatCard {
    label: string;
    value: string;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    comparison?: string;
    barWidth: string;
    barColor: string;
}

const PLAN_STAT_CARDS: Record<PlanType, StatCard[]> = {
    trial: [
        { label: "Total Emisi",         value: "1,2",  unit: "ton CO₂e", barWidth: "40%",  barColor: "#1D6B5A" },
        { label: "Total BBM",           value: "800",  unit: "L",        barWidth: "30%",  barColor: "#2A9478" },
        { label: "Asset Aktif",         value: "3 / 3",                  barWidth: "100%", barColor: "#B8962E" },
    ],
    starter: [
        { label: "Total Emisi",         value: "1,5",   unit: "ton CO₂e", trend: "▲ 12%", trendUp: false, comparison: "vs Des 2024", barWidth: "55%", barColor: "#1D6B5A" },
        { label: "Total BBM",           value: "1.200", unit: "L",        trend: "▲ 8%",  trendUp: false, comparison: "vs Des 2024", barWidth: "60%", barColor: "#2A9478" },
        { label: "Asset Aktif",         value: "8 / 10",                  barWidth: "80%", barColor: "#B8962E" },
    ],
    pro: [
        { label: "Total Emisi",         value: "1,5",   unit: "ton CO₂e", trend: "▲ 20%", trendUp: false, comparison: "vs Des 2024", barWidth: "65%", barColor: "#1D6B5A" },
        { label: "Total BBM",           value: "1.200", unit: "L",        trend: "▲ 12%", trendUp: false, comparison: "vs Des 2024", barWidth: "70%", barColor: "#2A9478" },
        { label: "Efisiensi Rata-rata", value: "8,2",   unit: "km/L",     trend: "▼ 10%", trendUp: true,  comparison: "vs Des 2024", barWidth: "50%", barColor: "#1D6B5A" },
        { label: "Asset Aktif",         value: "28 / 30",                 barWidth: "93%", barColor: "#B8962E" },
    ],
    enterprise: [
        { label: "Total Emisi",         value: "12,5",  unit: "ton CO₂e", trend: "▲ 15%", trendUp: false, comparison: "vs Des 2024", barWidth: "72%", barColor: "#1D6B5A" },
        { label: "Total BBM",           value: "9.800", unit: "L",        trend: "▲ 10%", trendUp: false, comparison: "vs Des 2024", barWidth: "78%", barColor: "#2A9478" },
        { label: "Asset Aktif",         value: "120 / 150+",              barWidth: "80%", barColor: "#B8962E" },
    ],
};

// ─── Chart dataset defaults & dynamic fallbacks ───────────────────────────────

const fallbackEmissionData = [
    { date: "1 Jan", emisi: 0.3 },
    { date: "8 Jan", emisi: 0.8 },
    { date: "15 Jan", emisi: 1.5 },
    { date: "22 Jan", emisi: 1.2 },
    { date: "29 Jan", emisi: 2.0 },
];

const fallbackFuelData = [
    { date: "1 Jan", bbm: 300 },
    { date: "8 Jan", bbm: 550 },
    { date: "15 Jan", bbm: 800 },
    { date: "22 Jan", bbm: 650 },
    { date: "29 Jan", bbm: 900 },
];

// Enterprise: multi-location emission
const enterpriseEmissionData = [
    { date: "1 Jan",  jakarta: 2.0, surabaya: 1.5, bali: 1.0, medan: 0.8 },
    { date: "8 Jan",  jakarta: 3.0, surabaya: 2.0, bali: 1.4, medan: 1.0 },
    { date: "15 Jan", jakarta: 4.5, surabaya: 2.8, bali: 1.8, medan: 1.2 },
    { date: "22 Jan", jakarta: 3.8, surabaya: 2.3, bali: 1.6, medan: 1.1 },
    { date: "29 Jan", jakarta: 5.0, surabaya: 3.1, bali: 2.0, medan: 1.4 },
];

// Enterprise: multi-location fuel
const enterpriseFuelData = [
    { date: "1 Jan",  jakarta: 1500, surabaya: 1200, bali: 800, medan: 600 },
    { date: "8 Jan",  jakarta: 2200, surabaya: 1600, bali: 1100, medan: 800 },
    { date: "15 Jan", jakarta: 3500, surabaya: 2200, bali: 1400, medan: 950 },
    { date: "22 Jan", jakarta: 3000, surabaya: 1800, bali: 1250, medan: 870 },
    { date: "29 Jan", jakarta: 4000, surabaya: 2500, bali: 1600, medan: 1100 },
];

// ─── Plan labels (dev switcher) ───────────────────────────────────────────────

const PLAN_LABELS: { id: PlanType; label: string }[] = [
    { id: "trial",      label: "Trial" },
    { id: "starter",    label: "Starter" },
    { id: "pro",        label: "Pro" },
    { id: "enterprise", label: "Enterprise" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCardGrid({ cards }: { cards: StatCard[] }) {
    return (
        <div className={`grid gap-3 ${cards.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
            {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-lg border border-neutral-200 px-4 py-3 flex flex-col gap-1">
                    <span className="text-xs text-[#8E8E8E]">{card.label}</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-gray-800">{card.value}</span>
                        {card.unit && <span className="text-xs text-[#8E8E8E]">{card.unit}</span>}
                    </div>
                    {card.trend && (
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${card.trendUp ? "text-green-500" : "text-red-400"}`}>
                            {card.trendUp
                                ? <TrendingDown className="h-3 w-3" />
                                : <TrendingUp className="h-3 w-3" />}
                            {card.trend}{" "}
                            <span className="text-[#8E8E8E] font-normal">{card.comparison}</span>
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

function PlanBanner({ plan }: { plan: PlanType }) {
    const cfg = PLAN_CONFIG[plan];
    return (
        <div
            className="rounded-lg border px-4 py-2.5 flex items-center gap-3"
            style={{ backgroundColor: cfg.lightBg, borderColor: cfg.border }}
        >
            <span
                className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: cfg.color }}
            >
                {cfg.badge}
            </span>
            <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                {cfg.assetLabel}
            </span>
            <span className="text-[11px] text-[#8E8E8E] flex-1">{cfg.description}</span>
            {(plan === "trial" || plan === "starter") && (
                <button
                    className="shrink-0 text-xs font-medium text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: cfg.color }}
                >
                    {plan === "trial" ? "Upgrade ke Starter" : "Upgrade ke Pro"}
                </button>
            )}
        </div>
    );
}

// ─── Locked overlay (grafik tetap render, tapi di-blur + gembok di atasnya) ───

function LockedChartOverlay({ upgradeLabel, upgradeColor }: { upgradeLabel: string; upgradeColor: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg z-10"
             style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(3px)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                <Lock className="h-4 w-4 text-[#8E8E8E]" />
            </div>
            <p className="text-xs text-[#8E8E8E] text-center px-4">Upgrade untuk melihat grafik lengkap</p>
            <button
                className="text-xs font-medium text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: upgradeColor }}
            >
                {upgradeLabel}
            </button>
        </div>
    );
}

function getTrendSeries(trendData?: any) {
    const emisi = (trendData?.emissionSeries?.[0]?.data ?? []).map((p: any) => ({
        date: p.date,
        emisi: p.value,
    }));
    const bbm = (trendData?.fuelSeries?.[0]?.data ?? []).map((p: any) => ({
        date: p.date,
        bbm: p.value,
    }));
    return {
        emissionData: emisi.length > 0 ? emisi : fallbackEmissionData,
        fuelData: bbm.length > 0 ? bbm : fallbackFuelData,
    };
}

// ─── Chart section: Trial (blurred) ──────────────────────────────────────────

function TrialCharts({ trendData }: { trendData?: any }) {
    const { emissionData, fuelData } = getTrendSeries(trendData);
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Tren Emisi — blurred */}
            <div className="relative bg-white rounded-lg border border-neutral-200 px-4 py-3 overflow-hidden">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Emisi (ton CO₂e)</p>
                <div style={{ filter: "blur(3px)", pointerEvents: "none" }}>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={emissionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                            <Line type="monotone" dataKey="emisi" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <LockedChartOverlay upgradeLabel="Upgrade ke Starter" upgradeColor="#1D6B5A" />
            </div>

            {/* Tren Konsumsi BBM — blurred */}
            <div className="relative bg-white rounded-lg border border-neutral-200 px-4 py-3 overflow-hidden">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Konsumsi BBM (Liter)</p>
                <div style={{ filter: "blur(3px)", pointerEvents: "none" }}>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={fuelData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="bbmGradientTrial" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2A9478" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#2A9478" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                            <Area type="monotone" dataKey="bbm" stroke="#2A9478" strokeWidth={2} fill="url(#bbmGradientTrial)" dot={{ r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <LockedChartOverlay upgradeLabel="Upgrade ke Starter" upgradeColor="#1D6B5A" />
            </div>
        </div>
    );
}

// ─── Chart section: Starter ───────────────────────────────────────────────────

function StarterCharts({ trendData }: { trendData?: any }) {
    const { emissionData, fuelData } = getTrendSeries(trendData);
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Tren Emisi */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Emisi (ton CO₂e)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={emissionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E5E7EB" }}
                            formatter={(v: any) => [`${v} ton`, "Emisi"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="emisi"
                            stroke="#1D9E75"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#1D9E75" }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tren Konsumsi BBM */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Konsumsi BBM (Liter)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={fuelData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="bbmGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2A9478" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#2A9478" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E5E7EB" }}
                            formatter={(v: any) => [`${v} L`, "BBM"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="bbm"
                            stroke="#2A9478"
                            strokeWidth={2}
                            fill="url(#bbmGradient)"
                            dot={{ r: 3, fill: "#2A9478" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ─── Chart section: Pro ───────────────────────────────────────────────────────

function ProCharts({ trendData }: { trendData?: any }) {
    const { emissionData } = getTrendSeries(trendData);
    const comparisonData = emissionData.map((p: { date: string; emisi: number }) => ({
        date: p.date,
        jan2025: p.emisi,
        des2024: parseFloat((p.emisi * 0.85).toFixed(2)),
    }));

    const comp1 = trendData?.periodComparison?.[0];
    const compCards = comp1
        ? [
            { label: "Bulan Berjalan", value: `${comp1.current} ${comp1.unit}` },
            { label: "Bulan Sebelumnya", value: `${comp1.previous} ${comp1.unit}` },
            { label: "Perubahan", value: `${comp1.changeUp ? "▲" : "▼"} ${comp1.changePercent}%`, highlight: true },
        ]
        : [
            { label: "Jan 2026", value: "1,5 ton CO₂e" },
            { label: "Des 2025", value: "1,25 ton CO₂e" },
            { label: "Perubahan", value: "▲ 20%", highlight: true },
        ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Tren Emisi - comparison */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Emisi (ton CO₂e) — Perbandingan</p>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={comparisonData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E5E7EB" }}
                            formatter={(v: any, name: any) => [
                                `${v} ton`,
                                name === "jan2025" ? "Aktual" : "Target Emisi",
                            ]}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                            formatter={(v) => (v === "jan2025" ? "Aktual" : "Target Emisi")}
                        />
                        <Line type="monotone" dataKey="jan2025" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="des2024" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Perbandingan ringkas */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3 flex flex-col justify-between">
                <p className="text-xs font-semibold text-gray-700 mb-3">Perbandingan Periode</p>
                <div className="grid grid-cols-3 gap-2 text-center flex-1">
                    {compCards.map((item) => (
                        <div key={item.label} className="flex flex-col items-center justify-center gap-1 rounded-lg bg-neutral-50 border border-neutral-100 py-4">
                            <span className="text-[10px] text-[#8E8E8E]">{item.label}</span>
                            <span className={`text-sm font-bold ${item.highlight ? "text-red-400" : "text-gray-800"}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Chart section: Enterprise ────────────────────────────────────────────────

const LOCATION_COLORS: Record<string, string> = {
    jakarta:  "#1D6B5A",
    surabaya: "#2A9478",
    bali:     "#B8962E",
    medan:    "#6366F1",
};

function EnterpriseCharts() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Tren Emisi per Lokasi */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Emisi per Lokasi (ton CO₂e)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={enterpriseEmissionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E5E7EB" }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                        {Object.entries(LOCATION_COLORS).map(([key, color]) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 2 }} name={key.charAt(0).toUpperCase() + key.slice(1)} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tren Konsumsi BBM per Lokasi */}
            <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">Tren Konsumsi BBM per Lokasi (Liter)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={enterpriseFuelData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#8E8E8E" }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E5E7EB" }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                        {Object.entries(LOCATION_COLORS).map(([key, color]) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 2 }} name={key.charAt(0).toUpperCase() + key.slice(1)} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportTrenTable() {
    const [plan, setPlan] = useState<PlanType>("pro");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const { data: trendRes, isLoading } = useTrends(plan);
    const trendData = trendRes?.data;

    useEffect(() => {
        const orgPlan = (trendData as any)?.organization?.plan;
        if (orgPlan) {
            const p = String(orgPlan).toLowerCase() as PlanType;
            if (["trial", "starter", "pro", "enterprise"].includes(p)) {
                setPlan(p);
            }
        }
    }, [trendData]);

    const filtered = useMemo(() => {
        const series = (trendData?.emissionSeries ?? []) as any[];
        if (!search) return series;
        return series.filter((s) =>
            s.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [trendData, search]);

    const handleExport = () => {
        const rows = (trendData?.emissionSeries ?? []) as any[];
        exportToCsv("Laporan_Tren_Emisi", rows, [
            { key: "label", label: "Periode / Bulan" },
            { key: "value", label: "Emisi (ton CO2e)" },
            { key: "fuelLiters", label: "Konsumsi BBM (Liter)" },
        ]);
    };

    const table = useReactTable({
        data: filtered,
        columns: trendColumns[plan],
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const isLocked = plan === "trial" || plan === "starter";

    return (
        <>
            {/* Plan switcher — Interactive Tier Preview */}
            <div className="flex items-center gap-2 -mt-2 -mx-6 px-6 pb-0">
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

            {/* Plan banner */}
            <PlanBanner plan={plan} />

            {/* Stat cards */}
            <StatCardGrid cards={PLAN_STAT_CARDS[plan]} />

            {/* ── Charts: semua plan dapat grafik, trial di-blur ── */}
            {plan === "trial"      && <TrialCharts trendData={trendData} />}
            {plan === "starter"    && <StarterCharts trendData={trendData} />}
            {plan === "pro"        && <ProCharts trendData={trendData} />}
            {plan === "enterprise" && <EnterpriseCharts />}

            {/* Tabel: trial & starter terkunci */}
            {isLocked ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 py-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                        <Lock className="h-4 w-4 text-[#8E8E8E]" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">Tabel Detail Terkunci</p>
                        <p className="mt-1 text-xs text-[#8E8E8E]">
                            {plan === "trial"
                                ? "Upgrade ke Starter untuk melihat data detail per asset."
                                : "Upgrade ke Pro untuk melihat perbandingan & insight otomatis."}
                        </p>
                    </div>
                    <button
                        onClick={() => setPlan(plan === "trial" ? "starter" : "pro")}
                        className="text-xs font-medium text-white rounded px-4 py-2 hover:opacity-90 transition-opacity bg-[#1D6B5A] cursor-pointer"
                    >
                        {plan === "trial" ? "Upgrade ke Starter" : "Upgrade ke Pro"}
                    </button>
                </div>
            ) : (
                <div key={plan} className="space-y-4">
                    <ReportTrenTableToolbar
                        table={table}
                        search={search}
                        setSearch={setSearch}
                        plan={plan}
                        onExport={handleExport}
                    />
                    <div className="rounded-xl border border-[#DEDAD0] bg-white overflow-hidden shadow-xs">
                        <DataGrid
                            table={table}
                            columnsLength={trendColumns[plan].length}
                            isLoading={false}
                            isError={false}
                        />
                    </div>
                </div>
            )}
        </>
    );
}