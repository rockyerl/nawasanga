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
import { Lock, AlertTriangle, Zap, Lightbulb, Download, Award } from "lucide-react";
import { DataGrid } from "@/components/data-grid";
import { auditColumns } from "@/features/report-audit/components/report-audit-columns";
import { ReportAuditTableToolbar } from "@/features/report-audit/components/report-audit-table-toolbar";
import { useAuditInsights } from "@/features/report-audit/hooks/use-report-audit-queries";
import { exportToCsv } from "@/lib/export";
import { AuditCertificateDialog } from "@/features/report-audit/components/audit-certificate-dialog";
import { CarbonOffsetSimulator } from "@/features/report-audit/components/carbon-offset-simulator";
import type { PlanType, AuditTypes } from "@/types/features/report-audit.type";

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
        description: "Fitur terbatas. Upgrade untuk mengakses insight & laporan audit.",
        color: "#7A7A72",
        lightBg: "#F7F5EF",
        border: "#EDEAE0",
    },
    starter: {
        badge: "STARTER PLAN",
        assetLabel: "10 Asset",
        description: "Laporan dasar tersedia. Upgrade ke Pro untuk fitur insight & audit compliance.",
        color: "#3B82F6",
        lightBg: "#EFF6FF",
        border: "#BFDBFE",
    },
    pro: {
        badge: "PRO PLAN",
        assetLabel: "30 Asset",
        description: "Insight otomatis, deteksi anomaly & rekomendasi untuk optimasi emisi.",
        color: "#1D6B5A",
        lightBg: "#EEF5F3",
        border: "#A2CFC5",
    },
    enterprise: {
        badge: "ENTERPRISE PLAN",
        assetLabel: "100+ Asset",
        description: "Laporan audit lengkap, benchmark multi-lokasi & audit ready IPCC.",
        color: "#B8962E",
        lightBg: "#FEF9EC",
        border: "#E8DEC0",
    },
};

// ─── Plan labels (dev switcher) ───────────────────────────────────────────────

const PLAN_LABELS: { id: PlanType; label: string }[] = [
    { id: "trial",      label: "Trial" },
    { id: "starter",    label: "Starter" },
    { id: "pro",        label: "Pro" },
    { id: "enterprise", label: "Enterprise" },
];

// ─── Insight icon map ─────────────────────────────────────────────────────────

const INSIGHT_ICON: Record<AuditTypes.Service.InsightType, React.ReactNode> = {
    anomaly:        <AlertTriangle className="h-4 w-4 text-red-500" />,
    efficiency:     <Zap className="h-4 w-4 text-[#1D9E75]" />,
    recommendation: <Lightbulb className="h-4 w-4 text-[#EF9F27]" />,
};

const INSIGHT_BG: Record<AuditTypes.Service.InsightType, string> = {
    anomaly:        "bg-red-50",
    efficiency:     "bg-[#F0FBF7]",
    recommendation: "bg-[#FFFBF0]",
};

const INSIGHT_BORDER: Record<AuditTypes.Service.InsightType, string> = {
    anomaly:        "border-l-red-400",
    efficiency:     "border-l-[#1D9E75]",
    recommendation: "border-l-[#EF9F27]",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
                    {plan === "trial" ? "Upgrade ke Pro" : "Upgrade ke Pro"}
                </button>
            )}
        </div>
    );
}

function LockedSection() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                <Lock className="h-6 w-6 text-[#8E8E8E]" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">Fitur Insight / Custom Terkunci</p>
                <p className="mt-1 text-xs text-[#8E8E8E]">
                    Fitur Insight tersedia di Pro ke atas.
                    <br />
                    Upgrade untuk mengakses deteksi anomaly, rekomendasi & laporan audit.
                </p>
            </div>
            <button className="text-xs font-medium text-white rounded px-4 py-2 hover:opacity-90 transition-opacity bg-[#1D9E75]">
                Upgrade ke Pro
            </button>
        </div>
    );
}

function InsightCardList({ insights }: { insights: AuditTypes.Service.InsightItem[] }) {
    return (
        <div className="flex flex-col gap-3">
            {insights.map((item, i) => (
                <div
                    key={i}
                    className={`rounded-lg border border-l-4 ${INSIGHT_BORDER[item.type]} border-neutral-200 bg-white px-4 py-3 flex flex-col gap-2`}
                >
                    <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${INSIGHT_BG[item.type]}`}>
                            {INSIGHT_ICON[item.type]}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                            <span className="text-xs text-[#8E8E8E] leading-relaxed">{item.description}</span>
                        </div>
                    </div>
                    {item.actionLabel && (
                        <span className="ml-9 text-xs font-medium text-[#1D9E75] underline cursor-pointer self-start">
                            {item.actionLabel}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

function BenchmarkSection({ benchmarks }: { benchmarks: AuditTypes.Service.BenchmarkItem[] }) {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-700">Benchmark Internal</span>
            <div className="flex flex-col gap-2 mt-1">
                {benchmarks.map((b) => (
                    <div key={b.location} className="flex items-center gap-3">
                        <span className="text-xs text-[#8E8E8E] w-16 shrink-0">{b.location}</span>
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.min(b.percent, 100)}%`,
                                    backgroundColor: b.color,
                                }}
                            />
                        </div>
                        <span
                            className="text-xs font-medium w-9 text-right"
                            style={{ color: b.percent > 100 ? "#EF4444" : b.color }}
                        >
                            {b.percent}%
                        </span>
                    </div>
                ))}
            </div>
            <span className="text-[10px] text-[#8E8E8E]">% dari target efisiensi</span>
        </div>
    );
}

function AuditReportSection({ report, onOpenCert }: { report: AuditTypes.Service.AuditReport; onOpenCert?: () => void }) {
    const total = report.totalEmission;
    // Donut arc calculation
    let offset = 0;
    const R = 26;
    const C = 2 * Math.PI * R;

    return (
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Laporan Audit / Custom</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">{report.period}</span>
                    <button className="text-[11px] font-medium text-white bg-[#EF9F27] rounded px-2.5 py-1 hover:opacity-90 transition-opacity">
                        Export ESG
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Breakdown */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8E8E8E]">
                        Spec 1 Breakdown
                    </span>
                    <div className="flex items-center gap-3">
                        {/* Donut chart */}
                        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                            <circle cx="36" cy="36" r={R} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                            {report.breakdown.map((seg) => {
                                const dash = (seg.percent / 100) * C;
                                const el = (
                                    <circle
                                        key={seg.label}
                                        cx="36"
                                        cy="36"
                                        r={R}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth="10"
                                        strokeDasharray={`${dash} ${C - dash}`}
                                        strokeDashoffset={-offset}
                                    />
                                );
                                offset += dash;
                                return el;
                            })}
                        </svg>
                        {/* Legend */}
                        <div className="flex flex-col gap-1">
                            {report.breakdown.map((seg) => (
                                <div key={seg.label} className="flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ backgroundColor: seg.color }}
                                    />
                                    <span className="text-[11px] text-[#8E8E8E]">
                                        {seg.label} {seg.tonCO2e} ton ({seg.percent}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Methodology */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8E8E8E]">
                        Metodologi
                    </span>
                    <table className="text-[11px] w-full">
                        <tbody>
                        {[
                            ["Standar",        report.methodology.standard],
                            ["Scope",          report.methodology.scope],
                            ["Faktor Emisi",   report.methodology.emissionFactor],
                            ["Perhitungan",    report.methodology.calculation],
                        ].map(([label, value]) => (
                            <tr key={label}>
                                <td className="text-[#8E8E8E] py-0.5 pr-2 w-24">{label}</td>
                                <td className="text-gray-700 font-medium py-0.5">{value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Download & Certificate Actions */}
            <div className="border-t border-neutral-100 pt-3 flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8E8E8E]">
                    Dokumen &amp; Sertifikat Resmi
                </span>
                <span className="text-[11px] text-[#8E8E8E]">Unduh data emisi audit atau cetak sertifikat verifikasi ISO 14064</span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => {
                            exportToCsv("Audit_Kepatuhan_ESG", report.breakdown || [], [
                                { key: "label", label: "Sumber Emisi / Kategori" },
                                { key: "tonCO2e", label: "Emisi (ton CO2e)" },
                                { key: "percent", label: "Porsi (%)" },
                            ]);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#1D6B5A] border border-[#1D6B5A] bg-[#1D6B5A]/5 rounded-lg px-3 py-1.5 hover:bg-[#1D6B5A]/10 transition-colors cursor-pointer"
                    >
                        <Download className="h-3.5 w-3.5" />
                        {report.downloadLabel || "Unduh Dokumen Laporan Kepatuhan Audit ESG (.CSV)"}
                    </button>
                    {onOpenCert && (
                        <button
                            type="button"
                            onClick={onOpenCert}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1D6B5A] hover:bg-[#155245] rounded-lg px-3.5 py-1.5 transition-all shadow-xs cursor-pointer"
                        >
                            <Award className="h-3.5 w-3.5 text-amber-300" />
                            Pratinjau &amp; Cetak Sertifikat ISO 14064
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportAuditTable() {
    const [plan, setPlan] = useState<PlanType>("pro");
    const [certOpen, setCertOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const { data: auditRes, isLoading } = useAuditInsights(plan);
    const data = auditRes?.data || { insights: [] };
    const orgName = (auditRes as any)?.data?.organization?.name || "PT Sinergi Logistik Nusantara";

    useEffect(() => {
        const orgPlan = (auditRes as any)?.data?.organization?.plan;
        if (orgPlan) {
            const p = String(orgPlan).toLowerCase() as PlanType;
            if (["trial", "starter", "pro", "enterprise"].includes(p)) {
                setPlan(p);
            }
        }
    }, [auditRes]);

    const filtered = useMemo(() => {
        const insights = data.insights ?? [];
        if (!search) return insights;
        return insights.filter((s) =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    const table = useReactTable({
        data: filtered,
        columns: auditColumns[plan],
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

            {/* Locked: tampil gembok, tidak ada konten */}
            {isLocked ? (
                <LockedSection />
            ) : (
                <div key={plan} className="space-y-4">
                    {/* Insight cards */}
                    <InsightCardList insights={data.insights} />

                    {/* Benchmark — enterprise only */}
                    {data.benchmarks && (
                        <BenchmarkSection benchmarks={data.benchmarks} />
                    )}

                    {/* Audit report — enterprise only */}
                    {data.auditReport && (
                        <AuditReportSection report={data.auditReport} onOpenCert={() => setCertOpen(true)} />
                    )}

                    {/* Simulator Dekarbonisasi & Kredit Karbon IDXCarbon */}
                    <CarbonOffsetSimulator
                        initialEmissionsTon={data.auditReport?.totalEmission ? Math.round(data.auditReport.totalEmission / 1000 * 10) / 10 : 48.2}
                        organizationName={orgName}
                    />

                    {/* Tabel insight */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <ReportAuditTableToolbar
                            table={table}
                            search={search}
                            setSearch={setSearch}
                            plan={plan}
                        />
                        <button
                            type="button"
                            onClick={() => setCertOpen(true)}
                            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1D6B5A] hover:bg-[#155245] rounded-lg px-3.5 py-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                        >
                            <Award className="h-3.5 w-3.5 text-amber-300" />
                            Sertifikat Emisi ISO 14064
                        </button>
                    </div>

                    <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                        <DataGrid
                            table={table}
                            columnsLength={auditColumns[plan].length}
                            isLoading={false}
                            isError={false}
                        />
                    </div>
                </div>
            )}

            <AuditCertificateDialog
                open={certOpen}
                setOpen={setCertOpen}
                organizationName={orgName}
                totalTonCO2e={data.auditReport?.totalEmission ? Math.round(data.auditReport.totalEmission / 1000 * 10) / 10 : 48.2}
            />
        </>
    );
}