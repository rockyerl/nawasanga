"use client";

import { Layout } from "@/components/layouts/layout";
import { useState } from "react";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
    ChevronDown, Lock, Lightbulb, AlertTriangle,
    Sparkles, Download, FileText, Plus, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import {
    trialStatCards, trialEmissionsData, trialTopEmitters, trialAssets,
    starterStatCards, starterEmissionsData, starterTopEmitters, starterAssets, starterAssetUsage,
    proStatCards, proEmissionsData, proTopEmitters, proInsights, proAssets,
    enterpriseStatCards, enterpriseEmissionsData, enterpriseLocationBars,
    enterprisePerformanceCategories, enterpriseInsights, enterpriseAssets,
    type PlanType, type StatCard, type TopEmitter, type AssetRow, type InsightBox,
} from "@/lib/mock-data/dashboard.mock";

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

function TopEmitterList({ emitters }: { emitters: TopEmitter[] }) {
    return (
        <div className="flex flex-col gap-2">
            {emitters.map((e, i) => (
                <div key={e.name} className="flex items-center gap-2 text-xs">
                    <span className="text-[#8E8E8E] w-4">{i + 1}</span>
                    <span className="text-gray-700 w-24 truncate">{e.name}</span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-[#1D9E75]" style={{ width: `${e.pct}%` }} />
                    </div>
                    <span className="text-[#8E8E8E] w-10 text-right">{e.value}t</span>
                    <span className="text-[#8E8E8E] w-8 text-right">{e.pct}%</span>
                </div>
            ))}
        </div>
    );
}

function AssetTable({ rows, showLocation, showEfisiensi, showTrend }: {
    rows: AssetRow[];
    showLocation?: boolean;
    showEfisiensi?: boolean;
    showTrend?: boolean;
}) {
    return (
        <table className="w-full text-xs">
            <thead>
            <tr className="border-b border-neutral-100">
                <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Nama Asset</th>
                {showLocation && <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Lokasi</th>}
                <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Kategori</th>
                <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Konsumsi (L)</th>
                <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Emisi (ton CO₂e)</th>
                {showEfisiensi && <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Efisiensi (km/l)</th>}
                {showTrend && <th className="text-left text-[#8E8E8E] font-medium py-2 pr-3">Trend</th>}
                <th className="text-left text-[#8E8E8E] font-medium py-2">Status</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((row) => (
                <tr key={row.name} className="border-b border-neutral-50 last:border-0">
                    <td className="py-2 pr-3 text-gray-700 font-medium">{row.name}</td>
                    {showLocation && <td className="py-2 pr-3 text-[#8E8E8E]">{row.location ?? "—"}</td>}
                    <td className="py-2 pr-3 text-[#8E8E8E]">{row.kategori}</td>
                    <td className="py-2 pr-3 text-[#8E8E8E]">{row.konsumsi.toLocaleString("id-ID")}</td>
                    <td className="py-2 pr-3 text-[#8E8E8E]">{row.emisi}</td>
                    {showEfisiensi && <td className="py-2 pr-3 text-[#8E8E8E]">{row.efisiensi ?? "—"}</td>}
                    {showTrend && (
                        <td className="py-2 pr-3">
                            {row.trend === "up"   && <TrendingUp   className="h-3.5 w-3.5 text-red-400" />}
                            {row.trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-green-500" />}
                            {row.trend === "flat" && <Minus        className="h-3.5 w-3.5 text-[#8E8E8E]" />}
                        </td>
                    )}
                    <td className="py-2">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Aktif" ? "bg-green-500" : "bg-neutral-300"}`} />
                <span className="text-[#8E8E8E]">{row.status}</span>
              </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
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

// ─── Plan: TRIAL ─────────────────────────────────────────────────────────────

function TrialDashboard() {
    const [period, setPeriod] = useState("Bulanan");
    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={trialStatCards} />

            <div className="grid grid-cols-2 gap-4">
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
                            <LineChart data={trialEmissionsData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                    <TopEmitterList emitters={trialTopEmitters} />
                </div>
            </div>

            {/* Locked insight banner */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 flex items-center gap-3">
                <Lock className="h-4 w-4 text-[#8E8E8E] shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700">Insight Lanjutan</p>
                    <p className="text-[10px] text-[#8E8E8E]">Dapatkan analisis mendalam, deteksi anomali, dan rekomendasi penghematan.</p>
                </div>
                <button className="text-xs bg-[#1D9E75] text-white rounded px-3 py-1.5 font-medium whitespace-nowrap hover:bg-[#0F6E56] transition-colors">
                    Upgrade ke Pro
                </button>
            </div>

            {/* Asset table */}
            <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">Asset Anda (3/3)</span>
                </div>
                <AssetTable rows={trialAssets} />
            </div>
        </div>
    );
}

// ─── Plan: STARTER ───────────────────────────────────────────────────────────

function StarterDashboard() {
    const [period, setPeriod] = useState("Bulanan");
    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={starterStatCards} />

            <div className="grid grid-cols-2 gap-4">
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
                            <LineChart data={starterEmissionsData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value" stroke="#29A2A5" strokeWidth={2} dot={{ r: 3, fill: "#29A2A5", stroke: "#fff", strokeWidth: 1.5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 block mb-3">Top Emitter (Top 5)</span>
                    <TopEmitterList emitters={starterTopEmitters} />
                </div>
            </div>

            {/* Penggunaan Asset + Insight + Efisiensi (locked) */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-xs font-semibold text-gray-700 block mb-2">Penggunaan Asset</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-800">{starterAssetUsage.used}</span>
                        <span className="text-xs text-[#8E8E8E]">/ {starterAssetUsage.total}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#29A2A5]" style={{ width: `${(starterAssetUsage.used / starterAssetUsage.total) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] mt-2">Upgrade ke Pro untuk lebih banyak asset</p>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="h-3.5 w-3.5 text-[#1D9E75]" />
                        <span className="text-xs font-semibold text-gray-700">Insight</span>
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] leading-relaxed">
                        Emisi naik 15%, dibanding bulan lalu.<br />
                        Kendaraan A adalah penyumbang terbesar.
                    </p>
                    <span className="text-[10px] text-[#1D9E75] font-medium cursor-pointer mt-2 block hover:underline">
            Lihat Detail →
          </span>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Lock className="h-3.5 w-3.5 text-[#8E8E8E]" />
                        <span className="text-xs font-semibold text-gray-700">Efisiensi Detail</span>
                    </div>
                    <p className="text-[10px] text-[#8E8E8E] leading-relaxed">Lihat efisiensi per asset dan per kategori.</p>
                    <button className="mt-3 text-[10px] bg-[#1D9E75] text-white rounded px-2.5 py-1 font-medium hover:bg-[#0F6E56] transition-colors">
                        Upgrade ke Pro
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">Asset Terdaftar (8)</span>
                    <span className="text-xs text-[#1D9E75] cursor-pointer hover:underline">Lihat Semua</span>
                </div>
                <AssetTable rows={starterAssets} showEfisiensi />
            </div>
        </div>
    );
}

// ─── Plan: PRO ───────────────────────────────────────────────────────────────

function ProDashboard() {
    const [period, setPeriod] = useState("Bulanan");
    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={proStatCards} />

            <div className="grid grid-cols-2 gap-4">
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
                            { label: "Kendaraan", color: "#1D9E75" },
                            { label: "Genset",    color: "#29A2A5" },
                            { label: "Alat Berat",color: "#EF9F27" },
                        ].map((l) => (
                            <span key={l.label} className="flex items-center gap-1 text-[10px] text-[#8E8E8E]">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                                {l.label}
              </span>
                        ))}
                    </div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={proEmissionsData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value"     name="Kendaraan" stroke="#1D9E75" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="genset"    name="Genset"    stroke="#29A2A5" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="alatBerat" name="Alat Berat"stroke="#EF9F27" strokeWidth={1.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 block mb-3">Top Emitter (Top 5)</span>
                    <TopEmitterList emitters={proTopEmitters} />
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-3 gap-4">
                {proInsights.map((box) => (
                    <InsightCard key={box.title} box={box} />
                ))}
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">Asset Terdaftar (25)</span>
                    <span className="text-xs text-[#1D9E75] cursor-pointer hover:underline">Lihat Semua</span>
                </div>
                <AssetTable rows={proAssets} showEfisiensi showTrend />
            </div>
        </div>
    );
}

// ─── Plan: ENTERPRISE ────────────────────────────────────────────────────────

function EnterpriseDashboard() {
    const [period, setPeriod] = useState("Bulanan");
    return (
        <div className="flex flex-col gap-4">
            <StatCardGrid cards={enterpriseStatCards} />

            <div className="grid grid-cols-2 gap-4">
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
                            { label: "Jakarta", color: "#1D9E75" }, { label: "Surabaya", color: "#29A2A5" },
                            { label: "Bali",    color: "#EF9F27" }, { label: "Balikpapan", color: "#E24B4A" },
                        ].map((l) => (
                            <span key={l.label} className="flex items-center gap-1 text-[10px] text-[#8E8E8E]">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                                {l.label}
              </span>
                        ))}
                    </div>
                    <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enterpriseEmissionsData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: "#8E8E8E" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value"      name="Jakarta"    stroke="#1D9E75" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="surabaya"   name="Surabaya"   stroke="#29A2A5" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="bali"       name="Bali"       stroke="#EF9F27" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="balikpapan" name="Balikpapan" stroke="#E24B4A" strokeWidth={1.5} dot={false} />
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
            <div className="grid grid-cols-3 gap-4">
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

            {/* Asset table */}
            <div className="bg-white rounded-lg border border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">Asset Terdaftar (120+)</span>
                    <span className="text-xs text-[#1D9E75] cursor-pointer hover:underline">Lihat Semua</span>
                </div>
                <AssetTable rows={enterpriseAssets} showLocation showEfisiensi />
            </div>
        </div>
    );
}

// ─── Topbar helpers ───────────────────────────────────────────────────────────

function CommonTopbar({ plan }: { plan: PlanType }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                <p className="text-sm text-[#8E8E8E]">Ringkasan emisi dan performa perusahaan Anda</p>
            </div>
            <div className="flex items-center gap-3">
                {plan === "enterprise" && (
                    <>
                        <button className="flex items-center gap-1.5 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                            Semua Lokasi <ChevronDown className="h-3 w-3" />
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                            Semua Kategori <ChevronDown className="h-3 w-3" />
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                            <Download className="h-3 w-3" /> Export
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 py-1.5 hover:bg-neutral-50 transition-colors">
                            <FileText className="h-3 w-3" /> Buat Laporan
                        </button>
                        <button className="flex items-center gap-1.5 text-xs bg-[#1D9E75] text-white rounded px-2.5 py-1.5 hover:bg-[#0F6E56] transition-colors font-medium">
                            <Plus className="h-3 w-3" /> Tambah Data
                        </button>
                    </>
                )}
                <span className="text-sm text-[#29A2A5]">Last Login: 09/03/26 12:45</span>
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

export default function DashboardPage() {
    const [plan, setPlan] = useState<PlanType>("trial");

    return (
        <Layout>
            {/* Plan switcher — dev/demo only, remove in production */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-0">
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

            <div className="flex-1 overflow-auto p-6">
                <CommonTopbar plan={plan} />
                {plan === "trial"      && <TrialDashboard />}
                {plan === "starter"    && <StarterDashboard />}
                {plan === "pro"        && <ProDashboard />}
                {plan === "enterprise" && <EnterpriseDashboard />}
            </div>
        </Layout>
    );
}