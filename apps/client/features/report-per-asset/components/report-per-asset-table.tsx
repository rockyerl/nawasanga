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
import { Lock, TrendingUp, TrendingDown, Download, FileDown } from "lucide-react";
import { DataGrid } from "@/components/data-grid";
import { assetColumns } from "@/features/report-per-asset/components/report-per-asset-columns";
import { PerAssetTableToolbar } from "@/features/report-per-asset/components/report-per-asset-table-toolbar";
import { useAssets } from "@/features/report-per-asset/hooks/report-per-asset-user-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { AssetData, PlanType } from "@/lib/mock-data/report-per-asset.mock";

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
        description: "Upgrade untuk melihat detail seluruh asset.",
        color: "#6B7280",
        lightBg: "#F9FAFB",
        border: "#E5E7EB",
    },
    starter: {
        badge: "STARTER PLAN",
        assetLabel: "10 Asset",
        description: "Ranking emisi dan tabel detail per kendaraan.",
        color: "#29A2A5",
        lightBg: "#F0FAFA",
        border: "#A7E4E5",
    },
    pro: {
        badge: "PRO PLAN",
        assetLabel: "30 Asset",
        description: "Efisiensi, status, dan analisis mendalam per asset.",
        color: "#1D9E75",
        lightBg: "#F0FBF7",
        border: "#6EE4C0",
    },
    enterprise: {
        badge: "ENTERPRISE PLAN",
        assetLabel: "100+ Asset",
        description: "Ranking global, multi-lokasi & Export Excel.",
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
        { label: "Top Asset",       value: "2",      unit: "ditampilkan", barWidth: "20%",  barColor: "#6B7280" },
        { label: "Total Emisi",     value: "1,2",    unit: "ton CO₂e",   barWidth: "40%",  barColor: "#1D9E75" },
        { label: "Total BBM",       value: "800",    unit: "L",          barWidth: "30%",  barColor: "#29A2A5" },
        { label: "Asset Aktif",     value: "3 / 3",  barWidth: "100%",   barColor: "#EF9F27" },
    ],
    starter: [
        { label: "Total Asset",     value: "8",       unit: "ditampilkan", barWidth: "50%",  barColor: "#29A2A5" },
        { label: "Total Emisi",     value: "1,5",     unit: "ton CO₂e",   trend: "▲ 12%", trendUp: false, comparison: "vs bulan lalu", barWidth: "55%", barColor: "#1D9E75" },
        { label: "Total BBM",       value: "1.200",   unit: "L",          trend: "▲ 8%",  trendUp: false, comparison: "vs bulan lalu", barWidth: "60%", barColor: "#29A2A5" },
        { label: "Asset Aktif",     value: "8 / 10",  barWidth: "80%",    barColor: "#EF9F27" },
    ],
    pro: [
        { label: "Total Asset",     value: "10",      unit: "ditampilkan", barWidth: "33%",  barColor: "#1D9E75" },
        { label: "Total Emisi",     value: "1,5",     unit: "ton CO₂e",   trend: "▼ 5%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "65%", barColor: "#1D9E75" },
        { label: "Total BBM",       value: "1.200",   unit: "L",          trend: "▼ 3%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "70%", barColor: "#29A2A5" },
        { label: "Asset Aktif",     value: "28 / 30", barWidth: "93%",    barColor: "#EF9F27" },
        { label: "Avg Efisiensi",   value: "8,2",     unit: "km/L",       trend: "▼ 2%",  trendUp: true, comparison: "vs bulan lalu", barWidth: "50%", barColor: "#1D9E75" },
    ],
    enterprise: [
        { label: "Total Asset",     value: "20",        unit: "ditampilkan", barWidth: "13%",  barColor: "#EF9F27" },
        { label: "Total Emisi",     value: "12,5",      unit: "ton CO₂e",   trend: "▼ 15%", trendUp: true, comparison: "vs Des 2024", barWidth: "72%", barColor: "#1D9E75" },
        { label: "Total BBM",       value: "9.800",     unit: "L",          trend: "▼ 10%", trendUp: true, comparison: "vs Des 2024", barWidth: "78%", barColor: "#29A2A5" },
        { label: "Asset Aktif",     value: "120 / 150+",barWidth: "80%",    barColor: "#EF9F27" },
        { label: "Avg Efisiensi",   value: "9,1",       unit: "km/L",       trend: "▼ 8%",  trendUp: true, comparison: "vs Des 2024", barWidth: "55%", barColor: "#1D9E75" },
    ],
};

// ─── Chart / preview data ─────────────────────────────────────────────────────

const RANKING_TRIAL = [
    { label: "Kendaraan A", emisi: 0.7, pct: 58, color: "#1D9E75" },
    { label: "Kendaraan B", emisi: 0.5, pct: 42, color: "#29A2A5" },
];

const RANKING_STARTER = [
    { label: "Kendaraan A", emisi: 0.60, bbm: 480, pct: 100, color: "#1D9E75" },
    { label: "Kendaraan B", emisi: 0.45, bbm: 360, pct: 75,  color: "#29A2A5" },
    { label: "Kendaraan C", emisi: 0.23, bbm: 185, pct: 38,  color: "#EF9F27" },
    { label: "Kendaraan D", emisi: 0.15, bbm: 120, pct: 25,  color: "#6B7280" },
    { label: "Kendaraan E", emisi: 0.14, bbm: 100, pct: 23,  color: "#D1D5DB" },
];

const EFISIENSI_PRO = [
    { label: "Kendaraan A", emisi: 0.60, bbm: 480, efisiensi: 10.2, status: "Baik",      statusColor: "#1D9E75", pct: 100 },
    { label: "Kendaraan B", emisi: 0.45, bbm: 360, efisiensi: 7.1,  status: "Perhatian", statusColor: "#EF9F27", pct: 70 },
    { label: "Kendaraan C", emisi: 0.23, bbm: 185, efisiensi: 9.0,  status: "Baik",      statusColor: "#1D9E75", pct: 38 },
    { label: "Kendaraan D", emisi: 0.15, bbm: 120, efisiensi: 5.5,  status: "Buruk",     statusColor: "#EF4444", pct: 25 },
    { label: "Kendaraan E", emisi: 0.14, bbm: 100, efisiensi: 8.3,  status: "Baik",      statusColor: "#1D9E75", pct: 23 },
];

const RANKING_ENTERPRISE = [
    { label: "Kendaraan A", lokasi: "Jakarta",  emisi: 1.20, bbm: 960,  efisiensi: 10.2, status: "Baik",      statusColor: "#1D9E75", pct: 100 },
    { label: "Kendaraan B", lokasi: "Surabaya", emisi: 0.90, bbm: 720,  efisiensi: 7.5,  status: "Perhatian", statusColor: "#EF9F27", pct: 75 },
    { label: "Kendaraan C", lokasi: "Bali",     emisi: 0.45, bbm: 360,  efisiensi: 9.0,  status: "Baik",      statusColor: "#1D9E75", pct: 38 },
    { label: "Kendaraan D", lokasi: "Medan",    emisi: 0.25, bbm: 200,  efisiensi: 4.5,  status: "Buruk",     statusColor: "#EF4444", pct: 21 },
    { label: "Genset 1",    lokasi: "Jakarta",  emisi: 0.35, bbm: 280,  efisiensi: 6.3,  status: "Perhatian", statusColor: "#EF9F27", pct: 29 },
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
                        ? "Detail seluruh asset, ranking lengkap, dan filter tersedia di Starter ke atas."
                        : "Kolom efisiensi, status asset, Export Excel, dan analisis tren tersedia di Pro ke atas."}
                </p>
            </div>
            <button className="shrink-0 text-xs bg-[#1D9E75] text-white rounded px-3 py-1.5 font-medium hover:bg-[#0F6E56] transition-colors">
                {plan === "trial" ? "Upgrade ke Starter" : "Upgrade ke Pro"}
            </button>
        </div>
    );
}

// ─── Laporan Per Asset preview section ───────────────────────────────────────

function LaporanPerAssetTrial() {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Per Asset</span>
                <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-gray-600">Top 2 Asset</span>
                <div className="flex flex-col gap-2">
                    {RANKING_TRIAL.map((item, i) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-[#8E8E8E] w-4">{i + 1}</span>
                            <span className="text-[11px] text-gray-700 w-24 shrink-0">{item.label}</span>
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                            </div>
                            <span className="text-[11px] text-[#8E8E8E] w-16 text-right shrink-0">{item.emisi} ton CO₂e</span>
                        </div>
                    ))}
                </div>

                {/* Locked upgrade CTA */}
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2.5">
                    <Lock className="h-3.5 w-3.5 text-[#8E8E8E] shrink-0" />
                    <span className="text-[11px] text-[#8E8E8E] flex-1">Upgrade untuk melihat detail seluruh asset</span>
                    <button className="shrink-0 text-[11px] font-medium text-white bg-[#29A2A5] rounded px-2.5 py-1 hover:opacity-90 transition-opacity">
                        Upgrade ke Starter
                    </button>
                </div>
            </div>
        </div>
    );
}

function LaporanPerAssetStarter() {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Per Asset</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                    <button className="text-[11px] text-[#8E8E8E] border border-neutral-200 rounded px-1.5 py-0.5 hover:bg-neutral-50">Filter</button>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: Ranking Emisi bar list */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Ranking Emisi (ton CO₂e)</span>
                    <div className="flex flex-col gap-1.5">
                        {RANKING_STARTER.map((item, i) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#8E8E8E] w-3">{i + 1}</span>
                                <span className="text-[10px] text-gray-700 w-20 shrink-0">{item.label}</span>
                                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                </div>
                                <span className="text-[10px] text-[#8E8E8E] w-8 text-right shrink-0">{item.emisi}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Tabel Detail */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tabel Detail</span>
                    <table className="w-full text-[10px]">
                        <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left font-medium text-[#8E8E8E] pb-1">Asset</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Emisi (ton CO₂e)</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">BBM (L)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {RANKING_STARTER.map((item) => (
                            <tr key={item.label} className="border-b border-neutral-50">
                                <td className="py-1 text-gray-700">{item.label}</td>
                                <td className="py-1 text-right text-gray-700 font-medium">{item.emisi}</td>
                                <td className="py-1 text-right text-[#8E8E8E]">{item.bbm}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                        <Download className="h-3 w-3" /> Unduh PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function LaporanPerAssetPro() {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Per Asset</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                    <button className="text-[11px] text-[#8E8E8E] border border-neutral-200 rounded px-1.5 py-0.5 hover:bg-neutral-50">Export</button>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: Efisiensi ranking */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Efisiensi (km/L)</span>
                    <div className="flex flex-col gap-1.5">
                        {EFISIENSI_PRO.map((item, i) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#8E8E8E] w-3">{i + 1}</span>
                                <span className="text-[10px] text-gray-700 w-20 shrink-0">{item.label}</span>
                                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(item.efisiensi / 12) * 100}%`,
                                            backgroundColor: item.statusColor,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-[#8E8E8E] w-8 text-right shrink-0">{item.efisiensi}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Tabel Detail lengkap */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tabel Detail</span>
                    <table className="w-full text-[10px]">
                        <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left font-medium text-[#8E8E8E] pb-1">Asset</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Emisi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">BBM</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Efisiensi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {EFISIENSI_PRO.map((item) => (
                            <tr key={item.label} className="border-b border-neutral-50">
                                <td className="py-1 text-gray-700">{item.label}</td>
                                <td className="py-1 text-right text-gray-700">{item.emisi}</td>
                                <td className="py-1 text-right text-[#8E8E8E]">{item.bbm}</td>
                                <td className="py-1 text-right text-gray-700">{item.efisiensi}</td>
                                <td className="py-1 text-right">
                                        <span
                                            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium text-white"
                                            style={{ backgroundColor: item.statusColor }}
                                        >
                                            {item.status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                        <Download className="h-3 w-3" /> Unduh PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function LaporanPerAssetEnterprise() {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-100">
                <span className="text-xs font-semibold text-gray-700">Laporan Per Asset</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">Januari 2025</span>
                    <span className="text-[11px] text-[#8E8E8E]">•</span>
                    <span className="text-[11px] text-[#8E8E8E]">Semua Lokasi ▾</span>
                    <button className="text-[11px] text-[#8E8E8E] border border-neutral-200 rounded px-1.5 py-0.5 hover:bg-neutral-50">Filter</button>
                    <button className="text-[11px] font-medium text-white bg-[#1D9E75] rounded px-2 py-0.5 flex items-center gap-1 hover:opacity-90">
                        <FileDown className="h-3 w-3" /> Export Excel
                    </button>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Left: Ranking Global */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Ranking Global (ton CO₂e)</span>
                    <div className="flex flex-col gap-1.5">
                        {RANKING_ENTERPRISE.map((item, i) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#8E8E8E] w-3">{i + 1}</span>
                                <div className="w-20 shrink-0">
                                    <div className="text-[10px] text-gray-700 leading-tight">{item.label}</div>
                                    <div className="text-[9px] text-[#8E8E8E]">{item.lokasi}</div>
                                </div>
                                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${item.pct}%`, backgroundColor: item.statusColor }}
                                    />
                                </div>
                                <span className="text-[10px] text-[#8E8E8E] w-8 text-right shrink-0">{item.emisi}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Tabel Detail Semua Lokasi */}
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-600">Tabel Detail (Semua Lokasi)</span>
                    <table className="w-full text-[10px]">
                        <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left font-medium text-[#8E8E8E] pb-1">Asset</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Lokasi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Emisi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Efisiensi</th>
                            <th className="text-right font-medium text-[#8E8E8E] pb-1">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {RANKING_ENTERPRISE.map((item) => (
                            <tr key={item.label} className="border-b border-neutral-50">
                                <td className="py-1 text-gray-700">{item.label}</td>
                                <td className="py-1 text-right text-[#8E8E8E]">{item.lokasi}</td>
                                <td className="py-1 text-right text-gray-700">{item.emisi}</td>
                                <td className="py-1 text-right text-gray-700">{item.efisiensi}</td>
                                <td className="py-1 text-right">
                                        <span
                                            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium text-white"
                                            style={{ backgroundColor: item.statusColor }}
                                        >
                                            {item.status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Pagination hint */}
                    <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-[10px] text-[#8E8E8E]">1 2 3 ... 20 ›</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LaporanPerAsset({ plan }: { plan: PlanType }) {
    if (plan === "trial")      return <LaporanPerAssetTrial />;
    if (plan === "starter")    return <LaporanPerAssetStarter />;
    if (plan === "pro")        return <LaporanPerAssetPro />;
    return <LaporanPerAssetEnterprise />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PerAssetTable() {
    const [plan, setPlan] = useState<PlanType>("trial");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const queryParams = useMemo(() => ({
        page: pagination.pageIndex + 1,
        itemPerPage: pagination.pageSize,
        sortBy: sorting[0]?.id ?? "rank",
        direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
        search,
    }), [pagination, sorting, search]);

    const { data, isLoading, isError } = useAssets(plan, queryParams);

    const items = useMemo<AssetData[]>(() => {
        const res = data as { data?: { items?: AssetData[] } } | undefined;
        return res?.data?.items ?? [];
    }, [data]);

    const totalCount = useMemo(() => {
        const res = data as { data?: { count?: number } } | undefined;
        return res?.data?.count ?? 0;
    }, [data]);

    const table = useReactTable({
        data: items,
        columns: assetColumns[plan],
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
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

            {/* Laporan Per Asset preview — ranking & tabel per plan */}
            <LaporanPerAsset plan={plan} />

            {/* Locked feature banner */}
            <LockedBanner plan={plan} />

            {/* Table */}
            <div key={plan} className="space-y-4">
                <PerAssetTableToolbar table={table} search={search} setSearch={setSearch} plan={plan} />
                <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                    <DataGrid
                        table={table}
                        columnsLength={assetColumns[plan].length}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </div>
            </div>
        </>
    );
}