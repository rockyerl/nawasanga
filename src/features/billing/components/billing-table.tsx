"use client";

import { useState, useMemo } from "react";
import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    Lock,
    Download,
    ChevronRight,
    Zap,
    Building2,
    BarChart3,
    Clock,
    CreditCard,
    Star,
    AlertTriangle,
} from "lucide-react";
import { PLAN_OPTIONS } from "@/features/billing/constants/billing.constants";
import { InvoiceViewerDialog, type InvoiceDetailData } from "@/features/billing/components/invoice-viewer-dialog";
import { useBillingList } from "@/features/billing/hooks/use-billing-queries";
import type { BillingTypes } from "@/types/features/billing.type";
import type { PlanType } from "@/types/features/report-tren.type";

// ─── Plan config (mirror dari report-tren-table) ──────────────────────────────

const PLAN_CONFIG: Record<PlanType, {
    badge: string;
    color: string;
    lightBg: string;
    border: string;
}> = {
    trial:      { badge: "TRIAL",      color: "#6B7280", lightBg: "#F9FAFB", border: "#E5E7EB" },
    starter:    { badge: "STARTER",    color: "#29A2A5", lightBg: "#F0FAFA", border: "#A7E4E5" },
    pro:        { badge: "PRO",        color: "#1D9E75", lightBg: "#F0FBF7", border: "#6EE4C0" },
    enterprise: { badge: "ENTERPRISE", color: "#EF9F27", lightBg: "#FFFBF0", border: "#FDD9A0" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(isoDate: string): number {
    const diff = new Date(isoDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Badge chip mirip admin side */
function PlanBadge({ plan }: { plan: PlanType }) {
    const cfg = PLAN_CONFIG[plan];
    return (
        <span
            className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full text-white tracking-wide"
            style={{ backgroundColor: cfg.color }}
        >
            {cfg.badge}
        </span>
    );
}

/** Kartu info utama plan aktif */
function ActivePlanCard({ billing }: { billing: BillingTypes.Service.BillingInfo }) {
    const cfg = PLAN_CONFIG[billing.currentPlan as PlanType] || PLAN_CONFIG.trial;
    const days = daysUntil(billing.expiresAt);
    const isExpiringSoon = days <= 7;
    const isTrial = billing.currentPlan === "trial";
    const usagePercent = Math.round((billing.assetUsed / billing.assetLimit) * 100);

    return (
        <div
            className="rounded-lg border px-5 py-4 flex flex-col gap-4"
            style={{ backgroundColor: cfg.lightBg, borderColor: cfg.border }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <PlanBadge plan={billing.currentPlan} />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{billing.companyName}</p>
                        <p className="text-xs text-[#8E8E8E] mt-0.5">
                            Aktif sejak {formatDate(billing.startedAt)}
                        </p>
                    </div>
                </div>

                {/* Expiry warning */}
                {isExpiringSoon && (
                    <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-md px-2.5 py-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span className="text-[11px] font-medium text-orange-600">
                            {days === 0 ? "Berakhir hari ini!" : `${days} hari lagi`}
                        </span>
                    </div>
                )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-3 gap-3">
                {/* Tanggal Kadaluarsa */}
                <div className="bg-white rounded-lg border border-neutral-200 px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-[#8E8E8E]" />
                        <span className="text-[10px] text-[#8E8E8E] font-medium uppercase tracking-wide">
                            {isTrial ? "Masa Trial" : "Tanggal Kadaluarsa"}
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(billing.expiresAt)}</p>
                    <p className={`text-[10px] font-medium ${isExpiringSoon ? "text-orange-500" : "text-[#8E8E8E]"}`}>
                        {days === 0 ? "Hari ini" : `${days} hari lagi`}
                    </p>
                </div>

                {/* Asset Usage */}
                <div className="bg-white rounded-lg border border-neutral-200 px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#8E8E8E]" />
                        <span className="text-[10px] text-[#8E8E8E] font-medium uppercase tracking-wide">
                            Asset Digunakan
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-800">{billing.assetUsed}</span>
                        <span className="text-xs text-[#8E8E8E]">/ {billing.assetLimit}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${usagePercent}%`,
                                backgroundColor: usagePercent >= 90 ? "#EF4444" : cfg.color,
                            }}
                        />
                    </div>
                </div>

                {/* Next Billing / Status */}
                <div className="bg-white rounded-lg border border-neutral-200 px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-[#8E8E8E]" />
                        <span className="text-[10px] text-[#8E8E8E] font-medium uppercase tracking-wide">
                            {isTrial ? "Status" : "Tagihan Berikutnya"}
                        </span>
                    </div>
                    {isTrial ? (
                        <p className="text-sm font-semibold text-gray-800">Gratis</p>
                    ) : (
                        <p className="text-sm font-semibold text-gray-800">
                            {billing.nextBillingDate ? formatDate(billing.nextBillingDate) : "-"}
                        </p>
                    )}
                    <p className="text-[10px] text-[#8E8E8E]">
                        {isTrial ? "Tidak ada biaya" : "Perpanjangan otomatis"}
                    </p>
                </div>
            </div>

            {/* Upgrade CTA for trial/starter */}
            {(billing.currentPlan === "trial" || billing.currentPlan === "starter") && (
                <div className="flex items-center justify-between rounded-md border px-3 py-2.5" style={{ borderColor: cfg.border, backgroundColor: "rgba(255,255,255,0.6)" }}>
                    <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                        <span className="text-xs text-gray-700">
                            {billing.currentPlan === "trial"
                                ? "Upgrade plan untuk fitur Lebih lengkap"
                                : "Upgrade plan untuk fitur Lebih lengkap"}
                        </span>
                    </div>
                    <button
                        className="shrink-0 text-xs font-semibold text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: billing.currentPlan === "trial" ? "#29A2A5" : "#1D9E75" }}
                    >
                        {billing.currentPlan === "trial" ? "Upgrade Plan" : "Upgrade Plan"}
                    </button>
                </div>
            )}
        </div>
    );
}

/** Kartu pilihan plan — mirip kolom di admin */
function PlanOptionCard({
                            option,
                            currentPlan,
                            onSelect,
                        }: {
    option: BillingTypes.Service.PlanOption;
    currentPlan: PlanType;
    onSelect: (plan: PlanType) => void;
}) {
    const isActive = option.id === currentPlan;
    const planOrder: PlanType[] = ["trial", "starter", "pro", "enterprise"];
    const isUpgrade = planOrder.indexOf(option.id) > planOrder.indexOf(currentPlan);
    const isDowngrade = planOrder.indexOf(option.id) < planOrder.indexOf(currentPlan);

    return (
        <div
            className={`relative rounded-lg border flex flex-col gap-3 px-4 py-4 transition-all ${
                isActive
                    ? "shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
            style={isActive ? {
                backgroundColor: option.lightBg,
                borderColor: option.border,
            } : {}}
        >
            {/* Recommended badge */}
            {option.recommended && !isActive && (
                <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: option.color }}
                >
                    <Star className="h-2.5 w-2.5 fill-white" /> REKOMENDASI
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1"
                        style={{ backgroundColor: option.color }}
                    >
                        {option.badge}
                    </span>
                    <p className="text-sm font-semibold text-gray-800">{option.name}</p>
                    <p className="text-[10px] text-[#8E8E8E] leading-relaxed mt-0.5">{option.description}</p>
                </div>
                {isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ color: option.color, borderColor: option.border }}>
                        Aktif
                    </span>
                )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-800">{option.price}</span>
                {option.priceNote && (
                    <span className="text-[11px] text-[#8E8E8E]">{option.priceNote}</span>
                )}
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-1.5">
                {option.features.map((f: any) => (
                    <div key={f.label} className="flex items-center gap-2">
                        {f.available ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: option.color }} />
                        ) : (
                            <XCircle className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
                        )}
                        <span className={`text-xs ${f.available ? "text-gray-700" : "text-neutral-400"}`}>
                            {f.label}
                            {f.locked && (
                                <Lock className="inline h-2.5 w-2.5 ml-1 text-neutral-300" />
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            {!isActive && (
                <button
                    onClick={() => onSelect(option.id)}
                    className="mt-1 w-full text-xs font-semibold rounded py-2 transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                    style={
                        isUpgrade
                            ? { backgroundColor: option.color, color: "#fff" }
                            : { backgroundColor: "transparent", border: `1px solid ${option.border ?? "#E5E7EB"}`, color: "#8E8E8E" }
                    }
                >
                    {isUpgrade ? (
                        <>
                            <Zap className="h-3 w-3" />
                            Upgrade ke {option.name}
                        </>
                    ) : isDowngrade ? (
                        <>Downgrade ke {option.name}</>
                    ) : (
                        <>Pilih {option.name}</>
                    )}
                    <ChevronRight className="h-3 w-3" />
                </button>
            )}

            {isActive && (
                <button
                    disabled
                    className="mt-1 w-full text-xs font-semibold rounded py-2 border"
                    style={{ borderColor: option.border, color: option.color, backgroundColor: "transparent" }}
                >
                    Plan Aktif ✓
                </button>
            )}
        </div>
    );
}

/** Tabel riwayat invoice */
function InvoiceTable({
    invoices,
    plan,
    onViewInvoice,
}: {
    invoices: any[];
    plan: PlanType;
    onViewInvoice: (inv: any) => void;
}) {
    const cfg = PLAN_CONFIG[plan] || PLAN_CONFIG.trial;

    if (plan === "trial" || invoices.length === 0) {
        return (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center py-10 gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                    <Clock className="h-4 w-4 text-[#8E8E8E]" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Belum Ada Riwayat Tagihan</p>
                <p className="text-xs text-[#8E8E8E]">
                    {plan === "trial"
                        ? "Upgrade ke plan berbayar untuk melihat riwayat tagihan."
                        : "Invoice akan muncul setelah pembayaran pertama."}
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <table className="w-full text-xs">
                <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left px-4 py-2.5 font-semibold text-[#8E8E8E] uppercase tracking-wide text-[10px]">ID Invoice</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[#8E8E8E] uppercase tracking-wide text-[10px]">Tanggal</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[#8E8E8E] uppercase tracking-wide text-[10px]">Jumlah</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[#8E8E8E] uppercase tracking-wide text-[10px]">Status</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-[#8E8E8E] uppercase tracking-wide text-[10px]">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((inv, i) => (
                    <tr
                        key={inv.id}
                        className={`border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${i === invoices.length - 1 ? "border-0" : ""}`}
                    >
                        <td className="px-4 py-3 font-mono font-semibold text-gray-800">{inv.id}</td>
                        <td className="px-4 py-3 text-[#8E8E8E]">{inv.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{inv.amount}</td>
                        <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    inv.status === "paid"
                                        ? "bg-green-50 text-green-600"
                                        : inv.status === "pending"
                                            ? "bg-orange-50 text-orange-600"
                                            : "bg-red-50 text-red-500"
                                }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                        inv.status === "paid" ? "bg-green-500" : inv.status === "pending" ? "bg-orange-500" : "bg-red-500"
                                    }`} />
                                    {inv.status === "paid" ? "Lunas" : inv.status === "pending" ? "Pending" : "Gagal"}
                                </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() => onViewInvoice(inv)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline cursor-pointer"
                                style={{ color: cfg.color }}
                            >
                                <Download className="h-3 w-3" />
                                Faktur Resmi
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Usage stats bar ──────────────────────────────────────────────────────────

function UsageOverview({ billing }: { billing: BillingTypes.Service.BillingInfo }) {
    const cfg = PLAN_CONFIG[billing.currentPlan as PlanType] || PLAN_CONFIG.trial;
    const usagePercent = Math.round((billing.assetUsed / billing.assetLimit) * 100);
    const plan = PLAN_OPTIONS.find((p) => p.id === billing.currentPlan);

    // fitur usage ringkasan sesuai plan
    const featureStats = [
        { label: "Asset Digunakan",      value: `${billing.assetUsed} / ${billing.assetLimit}`,  pct: usagePercent,  color: cfg.color },
        { label: "Input Data / Bulan",   value: billing.currentPlan === "trial" ? "2 / 5"     : billing.currentPlan === "starter" ? "41 / 100" : billing.currentPlan === "pro" ? "156 / ∞" : "842 / ∞",   pct: billing.currentPlan === "trial" ? 40 : billing.currentPlan === "starter" ? 41 : 100, color: "#29A2A5" },
        { label: "Export",               value: billing.currentPlan === "trial" ? "0 / 0"     : billing.currentPlan === "starter" ? "0 / 0"   : billing.currentPlan === "pro" ? "28 / ∞"  : "128 / ∞",   pct: billing.currentPlan === "trial" ? 0 : billing.currentPlan === "starter" ? 0 : 60,   color: "#EF9F27" },
        { label: "Insight Dilihat",      value: billing.currentPlan === "trial" ? "0 / 0"     : billing.currentPlan === "starter" ? "0 / 0"   : billing.currentPlan === "pro" ? "45 / ∞"  : "312 / ∞",   pct: billing.currentPlan === "trial" ? 0 : billing.currentPlan === "starter" ? 0 : 45,   color: "#1D9E75" },
    ];

    return (
        <div className="grid grid-cols-4 gap-3">
            {featureStats.map((stat) => {
                const isLocked = (stat.label === "Export" || stat.label === "Insight Dilihat") &&
                    (billing.currentPlan === "trial" || billing.currentPlan === "starter");
                return (
                    <div key={stat.label} className="bg-white rounded-lg border border-neutral-200 px-4 py-3 flex flex-col gap-1">
                        <span className="text-[10px] text-[#8E8E8E]">{stat.label}</span>
                        <div className="flex items-center gap-1.5">
                            {isLocked ? (
                                <span className="flex items-center gap-1 text-lg font-bold text-neutral-300">
                                    <Lock className="h-4 w-4" />
                                </span>
                            ) : (
                                <span className="text-xl font-bold text-gray-800">{stat.value.split(" / ")[0]}</span>
                            )}
                            {!isLocked && (
                                <span className="text-xs text-[#8E8E8E]">/ {stat.value.split(" / ")[1]}</span>
                            )}
                            {isLocked && (
                                <span className="text-[10px] bg-neutral-100 text-neutral-400 rounded px-1 py-0.5 ml-1">Pro+</span>
                            )}
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: isLocked ? "0%" : `${Math.min(stat.pct, 100)}%`,
                                    backgroundColor: stat.color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main client billing component ───────────────────────────────────────────

export function BillingView() {
    const { data: billingRes } = useBillingList();
    const liveBilling = billingRes?.data as any;

    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetailData | null>(null);

    const billing = useMemo(() => {
        if (liveBilling) return liveBilling;
        return {
            currentPlan: "pro",
            companyName: "PT Nusantara Logistik Makmur",
            startedAt: "2026-01-01",
            expiresAt: "2026-12-31",
            assetUsed: 6,
            assetLimit: 30,
            invoices: [],
        };
    }, [liveBilling]);

    const handleViewInvoice = (inv: any) => {
        const rawAmount = inv.rawAmount || parseInt(String(inv.amount).replace(/[^0-9]/g, ""), 10) || 4500000;
        setSelectedInvoice({
            id: inv.invoiceId || inv.id,
            invoiceNumber: inv.id,
            companyName: billing.companyName,
            plan: billing.currentPlan,
            amountIdr: rawAmount,
            amountFormatted: inv.amount,
            status: inv.status,
            paymentMethod: inv.paymentMethod || "Bank Transfer BCA",
            createdAt: new Date().toISOString(),
        });
        setViewerOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Active plan card */}
            <ActivePlanCard billing={billing} />

            {/* Usage overview */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-[#8E8E8E]" />
                    <h3 className="text-sm font-semibold text-gray-700">Penggunaan Kuota Armada</h3>
                </div>
                <UsageOverview billing={billing} />
            </div>

            {/* Invoice history */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-[#8E8E8E]" />
                    <h3 className="text-sm font-semibold text-gray-700">Riwayat Faktur &amp; Pembayaran</h3>
                </div>
                <InvoiceTable
                    invoices={billing.invoices}
                    plan={billing.currentPlan}
                    onViewInvoice={handleViewInvoice}
                />
            </div>

            {/* Invoice Official Viewer Dialog */}
            <InvoiceViewerDialog
                open={viewerOpen}
                setOpen={setViewerOpen}
                invoice={selectedInvoice}
            />
        </div>
    );
}