"use client";

import { useReactTable } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
} from "@tanstack/table-core";
import { useMemo, useState } from "react";
import { Lock, Download, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { DataGrid } from "@/components/data-grid";
import { reportColumns } from "@/features/report-summary/components/report-summary-columns";
import { ReportTableToolbar } from "@/features/report-summary/components/report-summary-table-toolbar";
import { mockReports, type PlanType } from "@/lib/mock-data/report-summary.mock";

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
        description: "Fitur terbatas. Upgrade untuk melihat laporan lengkap.",
        color: "#6B7280",
        lightBg: "#F9FAFB",
        border: "#E5E7EB",
    },
    starter: {
        badge: "STARTER PLAN",
        assetLabel: "10 Asset",
        description: "Laporan dasar untuk memantau emisi perusahaan Anda.",
        color: "#29A2A5",
        lightBg: "#F0FAFA",
        border: "#A7E4E5",
    },
    pro: {
        badge: "PRO PLAN",
        assetLabel: "30 Asset",
        description: "Analisis mendalam dan insight untuk optimasi emisi.",
        color: "#1D9E75",
        lightBg: "#F0FBF7",
        border: "#6EE4C0",
    },
    enterprise: {
        badge: "ENTERPRISE PLAN",
        assetLabel: "100+ Asset",
        description: "Laporan lengkap dengan multi-lokasi & audit ready.",
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
        { label: "Total Laporan",  value: "3",      barWidth: "30%",  barColor: "#6B7280" },
        { label: "Total Emisi",    value: "1,680",  unit: "kg CO₂",   barWidth: "40%",  barColor: "#1D9E75" },
        { label: "Total BBM",      value: "2,400",  unit: "L",        barWidth: "30%",  barColor: "#29A2A5" },
        { label: "Asset Aktif",    value: "3 / 3",  barWidth: "100%", barColor: "#EF9F27" },
    ],
    starter: [
        { label: "Total Laporan",  value: "6",      barWidth: "50%",  barColor: "#29A2A5" },
        { label: "Total Emisi",    value: "5,490",  unit: "kg CO₂",   trend: "▲ 12%", trendUp: false, comparison: "vs bulan lalu", barWidth: "55%", barColor: "#1D9E75" },
        { label: "Total BBM",      value: "7,860",  unit: "L",        trend: "▲ 8%",  trendUp: false, comparison: "vs bulan lalu", barWidth: "60%", barColor: "#29A2A5" },
        { label: "Asset Aktif",    value: "8 / 10", barWidth: "80%",  barColor: "#EF9F27" },
        { label: "Avg Emisi",      value: "14.8",   unit: "kg CO₂/L", barWidth: "45%", barColor: "#1D9E75" },
    ],
    pro: [
        { label: "Total Laporan",  value: "9",       barWidth: "75%",  barColor: "#1D9E75" },
        { label: "Total Emisi",    value: "18,900",  unit: "kg CO₂",   trend: "▼ 5%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "65%", barColor: "#1D9E75" },
        { label: "Total BBM",      value: "27,000",  unit: "L",        trend: "▼ 3%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "70%", barColor: "#29A2A5" },
        { label: "Asset Aktif",    value: "28 / 30", barWidth: "93%",  barColor: "#EF9F27" },
        { label: "Avg Emisi",      value: "15.2",    unit: "kg CO₂/L", trend: "▼ 2%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "50%", barColor: "#1D9E75" },
    ],
    enterprise: [
        { label: "Total Laporan",  value: "10",        barWidth: "90%",  barColor: "#EF9F27" },
        { label: "Total Emisi",    value: "68,600",    unit: "kg CO₂",   trend: "▼ 15%", trendUp: true, comparison: "vs Des 2024", barWidth: "72%", barColor: "#1D9E75" },
        { label: "Total BBM",      value: "98,000",    unit: "L",        trend: "▼ 10%", trendUp: true, comparison: "vs Des 2024", barWidth: "78%", barColor: "#29A2A5" },
        { label: "Asset Aktif",    value: "115 / 120+",barWidth: "96%",  barColor: "#EF9F27" },
        { label: "Avg Emisi",      value: "15.5",      unit: "kg CO₂/L", trend: "▼ 8%",  trendUp: true, comparison: "vs Des 2024", barWidth: "55%", barColor: "#1D9E75" },
    ],
};

// ─── Chart data ───────────────────────────────────────────────────────────────

const DATES = ["1 Jan", "8 Jan", "15 Jan", "22 Jan", "29 Jan"];

const CHART_DATA = {
    starter: {
        emission: [1.2, 1.5, 1.35, 1.8, 2.0],
    },
    pro: {
        jan2025:  [1.0, 1.12, 1.24, 1.36, 1.48],
        des2024:  [1.2, 1.28, 1.36, 1.44, 1.52],
    },
    enterprise: {
        jakarta:  [2.8, 3.0, 3.2, 3.4, 3.6],
        surabaya: [1.6, 1.7, 1.8, 1.7, 1.9],
        bali:     [1.2, 1.28, 1.36, 1.28, 1.44],
        medan:    [0.8, 0.85, 0.9, 0.88, 0.95],
    },
    topBBM: [
        { label: "Kendaraan A", percent: 40, color: "#1D9E75" },
        { label: "Kendaraan B", percent: 25, color: "#29A2A5" },
        { label: "Kendaraan C", percent: 20, color: "#EF9F27" },
        { label: "Kendaraan D", percent: 10, color: "#6B7280" },
        { label: "Kendaraan E", percent: 5,  color: "#D1D5DB" },
    ],
    topEmisiTrial: [
        { label: "Kendaraan A", value: "0,7 ton (40%)", percent: 40, color: "#1D9E75" },
        { label: "Kendaraan B", value: "0,5 ton (40%)", percent: 30, color: "#29A2A5" },
    ],
    donut: {
        starter:    [{ label: "Kendaraan", color: "#1D9E75", pct: 75 }, { label: "Genset", color: "#29A2A5", pct: 20 }, { label: "Lainnya", color: "#EF9F27", pct: 5 }],
        pro:        [{ label: "Kendaraan", color: "#1D9E75", pct: 70 }, { label: "Genset", color: "#29A2A5", pct: 22 }, { label: "Lainnya", color: "#EF9F27", pct: 8 }],
        enterprise: [{ label: "Kendaraan", color: "#1D9E75", pct: 75 }, { label: "Genset", color: "#29A2A5", pct: 15 }, { label: "Lainnya", color: "#EF9F27", pct: 10 }],
    },
    enterpriseBreakdown: [
        { location: "Jakarta",  values: [5.2, "(47%)"], color: "#1D9E75" },
        { location: "Surabaya", values: [3.1, "(28%)"], color: "#29A2A5" },
        { location: "Bali",     values: [2.6, "(24%)"], color: "#EF9F27" },
        { location: "Medan",    values: [1.4, "(13%)"], color: "#6B7280" },
    ],
    insightSingkatPro: [
        "Emisi naik 20% dari bulan lalu.",
        "2 asset menyumbang 70% dari total emisi.",
        "Efisiensi turun 10%.",
    ],
    insightStrategisEnterprise: [
        "Lokasi Jakarta naik 30%.",
        "Bali paling efisien.",
        "Potensi efisiensi total 20%.",
    ],
};

// ─── Plan labels (dev switcher) ───────────────────────────────────────────────

const PLAN_LABELS: { id: PlanType; label: string }[] = [
    { id: "trial",      label: "Trial" },
    { id: "starter",    label: "Starter" },
    { id: "pro",        label: "Pro" },
    { id: "enterprise", label: "Enterprise" },
];

// ─── Chart helpers ────────────────────────────────────────────────────────────

function polylinePoints(values: number[], w: number, h: number, min: number, max: number): string {
    const range = max - min || 1;
    return values
        .map((v, i) => {
            const x = (i / (values.length - 1)) * w;
            const y = h - ((v - min) / range) * (h - 8) - 4;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
}

function areaPoints(values: number[], w: number, h: number, min: number, max: number): string {
    const pts = polylinePoints(values, w, h, min, max);
    return `${pts} ${w},${h} 0,${h}`;
}

function donutArcs(segments: { label: string; color: string; pct: number }[], R = 26, cx = 36, cy = 36) {
    const C = 2 * Math.PI * R;
    let offset = 0;
    return segments.map((seg) => {
        const dash = (seg.pct / 100) * C;
        const el = { dash, offset, color: seg.color };
        offset += dash;
        return el;
    });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
            {plan === "trial" && (
                <button
                    className="shrink-0 text-xs font-medium text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: cfg.color }}
                >
                    Upgrade ke Starter
                </button>
            )}
            {plan === "starter" && (
                <button
                    className="shrink-0 text-xs font-medium text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: cfg.color }}
                >
                    Upgrade ke Pro
                </button>
            )}
        </div>
    );
}

function LockedBanner({ plan }: { plan: PlanType }) {
    if (plan === "pro" || plan === "enterprise") return null;
    return (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 flex items-center gap-3">
            <Lock className="h-4 w-4 text-[#8E8E8E] shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">Fitur Lanjutan Terkunci</p>
                <p className="text-[10px] text-[#8E8E8E]">
                    {plan === "trial"
                        ? "Data per kendaraan, driver, dan perbandingan periode tersedia di Starter ke atas."
                        : "Export Excel, analisis tren lanjutan, dan insight otomatis tersedia di Pro ke atas."}
                </p>
            </div>
            <button className="shrink-0 text-xs bg-[#1D9E75] text-white rounded px-3 py-1.5 font-medium hover:bg-[#0F6E56] transition-colors">
                {plan === "trial" ? "Upgrade ke Starter" : "Upgrade ke Pro"}
            </button>
        </div>
    );
}

// ─── Laporan Ringkasan section (charts per plan) ──────────────────────────────

function LaporanRingkasanTrial() {
    const W = 320; const H = 80;
    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Ringkasan</span>
                <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                    <Download className="h-3 w-3" /> Unduh PDF
                </button>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {/* Grafik tren dikunci */}
                <div className="relative rounded-lg overflow-hidden">
                    {/* Blurred ghost chart behind */}
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="opacity-20">
                        <polyline
                            points={polylinePoints([1.0, 1.5, 1.2, 1.8, 1.6], W, H, 0.5, 2.5)}
                            fill="none" stroke="#1D9E75" strokeWidth="2"
                        />
                        <polygon
                            points={areaPoints([1.0, 1.5, 1.2, 1.8, 1.6], W, H, 0.5, 2.5)}
                            fill="#1D9E75" fillOpacity="0.2"
                        />
                    </svg>
                    {/* Lock overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                            <Lock className="h-4 w-4 text-[#8E8E8E]" />
                        </div>
                        <span className="text-[11px] text-[#8E8E8E]">Upgrade untuk melihat grafik lengkap</span>
                    </div>
                </div>

                {/* Top Emisi (2 teratas) */}
                <div>
                    <span className="text-[11px] font-semibold text-gray-600">Top Emisi (2 Teratas)</span>
                    <div className="mt-2 flex flex-col gap-1.5">
                        {CHART_DATA.topEmisiTrial.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-[11px] text-[#8E8E8E] w-4">{i + 1}</span>
                                <span className="text-[11px] text-gray-700 w-24">{item.label}</span>
                                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                                </div>
                                <span className="text-[11px] text-[#8E8E8E] w-20 text-right">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upgrade CTA */}
                <button className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#1D9E75] border border-[#1D9E75] rounded py-2 hover:bg-[#F0FBF7] transition-colors">
                    🌿 Upgrade ke Starter untuk laporan lengkap
                </button>
            </div>
        </div>
    );
}

function LaporanRingkasanStarter() {
    const W = 400; const H = 90;
    const vals = CHART_DATA.starter.emission;
    const min = Math.min(...vals) - 0.2;
    const max = Math.max(...vals) + 0.2;
    const arcs = donutArcs(CHART_DATA.donut.starter);
    const R = 26; const C = 2 * Math.PI * R;

    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Ringkasan</span>
                <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                    <Download className="h-3 w-3" /> Unduh PDF
                </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: Tren Emisi line chart */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tren Emisi (ton CO₂e)</span>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
                        {/* Y gridlines */}
                        {[0.25, 0.5, 0.75].map((t) => (
                            <line key={t} x1="0" y1={H * t} x2={W} y2={H * t}
                                  stroke="#F3F4F6" strokeWidth="1" />
                        ))}
                        {/* Area */}
                        <polygon
                            points={areaPoints(vals, W, H, min, max)}
                            fill="#1D9E75" fillOpacity="0.1"
                        />
                        {/* Line */}
                        <polyline
                            points={polylinePoints(vals, W, H, min, max)}
                            fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {/* Dots */}
                        {vals.map((v, i) => {
                            const x = (i / (vals.length - 1)) * W;
                            const y = H - ((v - min) / (max - min)) * (H - 8) - 4;
                            return <circle key={i} cx={x} cy={y} r="3" fill="#1D9E75" />;
                        })}
                        {/* X labels */}
                        {DATES.map((d, i) => (
                            <text key={i} x={(i / (DATES.length - 1)) * W} y={H - 1}
                                  fontSize="8" fill="#9CA3AF" textAnchor="middle">{d}</text>
                        ))}
                    </svg>

                    {/* Top BBM 5 teratas bar chart */}
                    <span className="text-[11px] font-semibold text-gray-600 mt-1">Top BBM (5 Teratas)</span>
                    <div className="flex flex-col gap-1">
                        {CHART_DATA.topBBM.map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-700 w-20 shrink-0">{item.label}</span>
                                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                                </div>
                                <span className="text-[10px] text-[#8E8E8E] w-6 text-right">{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Distribusi Emisi donut + Unduh PDF */}
                <div className="flex flex-col gap-3">
                    <span className="text-[11px] font-semibold text-gray-600">Distribusi Emisi</span>
                    <div className="flex items-center gap-3">
                        <svg width="200" height="200" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                            <circle cx="36" cy="36" r={R} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                            {arcs.map((a, i) => (
                                <circle key={i} cx="36" cy="36" r={R} fill="none"
                                        stroke={a.color} strokeWidth="10"
                                        strokeDasharray={`${a.dash} ${C - a.dash}`}
                                        strokeDashoffset={-a.offset}
                                />
                            ))}
                        </svg>
                        <div className="flex flex-col gap-1">
                            {CHART_DATA.donut.starter.map((seg) => (
                                <div key={seg.label} className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                    <span className="text-[11px] text-[#8E8E8E]">{seg.label} {seg.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LaporanRingkasanPro() {
    const W = 400; const H = 90;
    const jan = CHART_DATA.pro.jan2025;
    const des = CHART_DATA.pro.des2024;
    const allVals = [...jan, ...des];
    const min = Math.min(...allVals) - 0.1;
    const max = Math.max(...allVals) + 0.1;
    const arcs = donutArcs(CHART_DATA.donut.pro);
    const R = 26; const C = 2 * Math.PI * R;

    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Ringkasan</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                    <span className="text-[11px] text-[#8E8E8E]">•</span>
                    <span className="text-[11px] text-[#8E8E8E]">Bandingkan ▾</span>
                    <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                        <Download className="h-3 w-3" /> Unduh PDF
                    </button>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: dual-line tren emisi */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tren Emisi (ton CO₂e)</span>
                    {/* Legend */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><span className="h-2 w-5 rounded-full inline-block" style={{ backgroundColor: "#1D9E75" }} /><span className="text-[10px] text-[#8E8E8E]">Jan 2025</span></div>
                        <div className="flex items-center gap-1"><span className="h-2 w-5 rounded-full inline-block" style={{ backgroundColor: "#29A2A5" }} /><span className="text-[10px] text-[#8E8E8E]">Des 2024</span></div>
                    </div>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
                        {[0.25, 0.5, 0.75].map((t) => (
                            <line key={t} x1="0" y1={H * t} x2={W} y2={H * t} stroke="#F3F4F6" strokeWidth="1" />
                        ))}
                        <polyline points={polylinePoints(des, W, H, min, max)} fill="none" stroke="#29A2A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
                        <polyline points={polylinePoints(jan, W, H, min, max)} fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {jan.map((v, i) => {
                            const x = (i / (jan.length - 1)) * W;
                            const y = H - ((v - min) / (max - min)) * (H - 8) - 4;
                            return <circle key={i} cx={x} cy={y} r="3" fill="#1D9E75" />;
                        })}
                        {DATES.map((d, i) => (
                            <text key={i} x={(i / (DATES.length - 1)) * W} y={H - 1} fontSize="8" fill="#9CA3AF" textAnchor="middle">{d}</text>
                        ))}
                    </svg>

                    {/* Insight Singkat */}
                    <span className="text-[11px] font-semibold text-gray-600 mt-1">Insight Singkat</span>
                    <div className="flex flex-col gap-1">
                        {CHART_DATA.insightSingkatPro.map((txt, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                                <span className="mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 bg-[#1D9E75]" />
                                {txt}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Distribusi Emisi donut */}
                <div className="flex flex-col gap-3">
                    <span className="text-[11px] font-semibold text-gray-600">Distribusi Emisi</span>
                    <div className="flex items-center gap-3">
                        <svg width="200" height="200" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                            <circle cx="36" cy="36" r={R} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                            {arcs.map((a, i) => (
                                <circle key={i} cx="36" cy="36" r={R} fill="none"
                                        stroke={a.color} strokeWidth="10"
                                        strokeDasharray={`${a.dash} ${C - a.dash}`}
                                        strokeDashoffset={-a.offset}
                                />
                            ))}
                        </svg>
                        <div className="flex flex-col gap-1">
                            {CHART_DATA.donut.pro.map((seg) => (
                                <div key={seg.label} className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                    <span className="text-[11px] text-[#8E8E8E]">{seg.label} {seg.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LaporanRingkasanEnterprise() {
    const W = 380; const H = 90;
    const series = CHART_DATA.enterprise;
    const allVals = [...series.jakarta, ...series.surabaya, ...series.bali, ...series.medan];
    const min = Math.min(...allVals) - 0.1;
    const max = Math.max(...allVals) + 0.2;
    const seriesList = [
        { key: "jakarta",  color: "#1D9E75", label: "Jakarta",  data: series.jakarta },
        { key: "surabaya", color: "#29A2A5", label: "Surabaya", data: series.surabaya },
        { key: "bali",     color: "#EF9F27", label: "Bali",     data: series.bali },
        { key: "medan",    color: "#6B7280", label: "Medan",    data: series.medan },
    ];
    const arcs = donutArcs(CHART_DATA.donut.enterprise);
    const R = 26; const C = 2 * Math.PI * R;

    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Ringkasan</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                    <span className="text-[11px] text-[#8E8E8E]">•</span>
                    <span className="text-[11px] text-[#8E8E8E]">Semua Lokasi ▾</span>
                    <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                        <Download className="h-3 w-3" /> Unduh PDF
                    </button>
                    <button className="text-[11px] font-medium text-white bg-[#EF9F27] rounded px-2 py-0.5">Export ESG</button>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: multi-line Tren per Lokasi + Distribusi Emisi */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tren Emisi per Lokasi (ton CO₂e)</span>
                    <div className="flex flex-wrap gap-2">
                        {seriesList.map((s) => (
                            <div key={s.key} className="flex items-center gap-1">
                                <span className="h-2 w-4 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                                <span className="text-[10px] text-[#8E8E8E]">{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
                        {[0.25, 0.5, 0.75].map((t) => (
                            <line key={t} x1="0" y1={H * t} x2={W} y2={H * t} stroke="#F3F4F6" strokeWidth="1" />
                        ))}
                        {seriesList.map((s) => (
                            <polyline key={s.key}
                                      points={polylinePoints(s.data, W, H, min, max)}
                                      fill="none" stroke={s.color} strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"
                            />
                        ))}
                        {DATES.map((d, i) => (
                            <text key={i} x={(i / (DATES.length - 1)) * W} y={H - 1} fontSize="8" fill="#9CA3AF" textAnchor="middle">{d}</text>
                        ))}
                    </svg>

                    {/* Distribusi Emisi */}
                    <span className="text-[11px] font-semibold text-gray-600">Breakdown per Lokasi</span>
                    <table className="w-full text-[11px]">
                        <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left font-medium text-[#8E8E8E] pb-1">Lokasi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">ton CO₂e</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {CHART_DATA.enterpriseBreakdown.map((row) => (
                            <tr key={row.location} className="border-b border-neutral-50">
                                <td className="py-1 flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                                    {row.location}
                                </td>
                                <td className="py-1 text-right text-gray-700 font-medium">{row.values[0]}</td>
                                <td className="py-1 text-right text-[#8E8E8E]">{row.values[1]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>

                {/* Right: Breakdown per Lokasi table + Insight Strategis */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600 mt-1">Distribusi Emisi</span>
                    <div className="flex items-center gap-3">
                        <svg width="160" height="160" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                            <circle cx="36" cy="36" r={R} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                            {arcs.map((a, i) => (
                                <circle key={i} cx="36" cy="36" r={R} fill="none"
                                        stroke={a.color} strokeWidth="10"
                                        strokeDasharray={`${a.dash} ${C - a.dash}`}
                                        strokeDashoffset={-a.offset}
                                />
                            ))}
                        </svg>
                        <div className="flex flex-col gap-1">
                            {CHART_DATA.donut.enterprise.map((seg) => (
                                <div key={seg.label} className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                    <span className="text-[11px] text-[#8E8E8E]">{seg.label} {seg.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>




                    {/* Insight Strategis */}
                    <span className="text-[11px] font-semibold text-gray-600 mt-1">Insight Strategis</span>
                    <div className="flex flex-col gap-1">
                        {CHART_DATA.insightStrategisEnterprise.map((txt, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                                <span className="mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 bg-[#EF9F27]" />
                                {txt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LaporanRingkasan({ plan }: { plan: PlanType }) {
    if (plan === "trial")      return <LaporanRingkasanTrial />;
    if (plan === "starter")    return <LaporanRingkasanStarter />;
    if (plan === "pro")        return <LaporanRingkasanPro />;
    return <LaporanRingkasanEnterprise />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportSummaryTable() {
    const [plan, setPlan] = useState<PlanType>("trial");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
            mockReports[plan].filter((row) =>
                row.id.toLowerCase().includes(search.toLowerCase()) ||
                row.period.toLowerCase().includes(search.toLowerCase())
            ),
        [plan, search]
    );

    const table = useReactTable({
        data: filtered,
        columns: reportColumns[plan],
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            {/* Plan switcher — dev/demo only, remove in production */}
            <div className="flex items-center gap-2 -mt-2 -mx-6 px-6 pb-0">
                <span className="text-xs text-[#8E8E8E] mr-1">Plan:</span>
                {PLAN_LABELS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                            plan === p.id
                                ? "bg-[#1D9E75] text-white border-transparent"
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

            {/* Laporan Ringkasan — grafik per plan */}
            <LaporanRingkasan plan={plan} />

            {/* Locked feature banner */}
            <LockedBanner plan={plan} />

            {/* Table */}
            <div key={plan} className="space-y-4">
                <ReportTableToolbar table={table} search={search} setSearch={setSearch} plan={plan} />
                <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                    <DataGrid
                        table={table}
                        columnsLength={reportColumns[plan].length}
                        isLoading={false}
                        isError={false}
                    />
                </div>
            </div>
        </>
    );
}