"use client";

import { useState, useMemo } from "react";
import {
    Banknote,
    Clock,
    FileText,
    CheckCircle2,
    Plus,
    Search,
    Printer,
    Download,
    Check,
    Building2,
    ArrowUpRight,
    ShieldCheck,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalBilling, useUpdateInvoiceStatus } from "@/features/billing/hooks/use-billing-queries";
import { useOrganizations } from "@/features/organization/hooks/organization-queries";
import { InvoiceViewerDialog, type InvoiceDetailData } from "@/features/billing/components/invoice-viewer-dialog";
import { CreateInvoiceDialog } from "@/features/billing/components/create-invoice-dialog";
import type { OrganizationTypes } from "@/types/features/organization.type";

const PLAN_BADGES: Record<string, { bg: string; text: string }> = {
    free:       { bg: "#F3F4F6", text: "#374151" },
    starter:    { bg: "#EFF6FF", text: "#1D4ED8" },
    pro:        { bg: "#ECFDF5", text: "#065F46" },
    enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};

export function GlobalBillingView() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orgFilter, setOrgFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [createOpen, setCreateOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetailData | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);

    const updateStatusMutation = useUpdateInvoiceStatus();

    const { data: billingData, isLoading } = useGlobalBilling({
        search,
        status: statusFilter,
        organizationId: orgFilter,
        page,
        itemPerPage: 15,
    });

    const { data: orgsData } = useOrganizations({ page: 1, itemPerPage: 100 });
    const organizations = useMemo(() => {
        const resp = orgsData?.data as { items?: OrganizationTypes.Service.OrganizationData[] } | undefined;
        return resp?.items || [];
    }, [orgsData]);

    const res = billingData?.data as any;
    const metrics = res?.metrics || {
        totalRevenueFormatted: "Rp 0",
        pendingAmountFormatted: "Rp 0",
        totalInvoices: 0,
        paidCount: 0,
        pendingCount: 0,
        collectionRate: 100,
    };
    const items: InvoiceDetailData[] = res?.items || [];

    const handleOpenViewer = (inv: InvoiceDetailData) => {
        setSelectedInvoice(inv);
        setViewerOpen(true);
    };

    const handleMarkAsPaid = (invId: string) => {
        updateStatusMutation.mutate({ id: invId, status: "paid" });
    };

    return (
        <div className="space-y-5">
            {/* Real KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="rounded-xl border border-[#EDEAE0] bg-white p-4.5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-[#7A7A72] uppercase tracking-wider">
                            Total Pendapatan Lunas
                        </p>
                        <p className="text-xl font-bold text-[#1D6B5A] mt-1">
                            {metrics.totalRevenueFormatted}
                        </p>
                        <p className="text-[11px] text-[#2A9478] font-medium mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {metrics.paidCount} Faktur berhasil ditagihkan
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5F3] flex items-center justify-center text-[#1D6B5A]">
                        <Banknote className="w-5 h-5" />
                    </div>
                </div>

                {/* Pending Invoices */}
                <div className="rounded-xl border border-[#EDEAE0] bg-white p-4.5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-[#7A7A72] uppercase tracking-wider">
                            Tagihan Menunggu (Outstanding)
                        </p>
                        <p className="text-xl font-bold text-[#C14B2A] mt-1">
                            {metrics.pendingAmountFormatted}
                        </p>
                        <p className="text-[11px] text-[#C14B2A] font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {metrics.pendingCount} Faktur belum lunas
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#C14B2A]">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                {/* Total Invoices Issued */}
                <div className="rounded-xl border border-[#EDEAE0] bg-white p-4.5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-[#7A7A72] uppercase tracking-wider">
                            Total Faktur Terbit
                        </p>
                        <p className="text-xl font-bold text-[#1A1A18] mt-1">
                            {metrics.totalInvoices} <span className="text-xs font-normal text-[#7A7A72]">Dokumen</span>
                        </p>
                        <p className="text-[11px] text-[#7A7A72] mt-0.5">
                            Faktur resmi terdaftar di database
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] flex items-center justify-center text-[#1A1A18]">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                {/* Collection Rate */}
                <div className="rounded-xl border border-[#EDEAE0] bg-white p-4.5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-[#7A7A72] uppercase tracking-wider">
                            Tingkat Pelunasan (Collection)
                        </p>
                        <p className="text-xl font-bold text-[#1D6B5A] mt-1">
                            {metrics.collectionRate}%
                        </p>
                        <div className="w-28 h-1.5 rounded-full bg-[#EDEAE0] mt-1.5 overflow-hidden">
                            <div
                                className="h-full bg-[#1D6B5A] rounded-full transition-all"
                                style={{ width: `${metrics.collectionRate}%` }}
                            />
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5F3] flex items-center justify-center text-[#1D6B5A]">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter Toolbar & Actions */}
            <div className="rounded-xl border border-[#EDEAE0] bg-white p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A7A72]" />
                        <Input
                            placeholder="Cari No. Faktur / Perusahaan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 text-xs border-[#DEDAD0] bg-[#F7F5EF] h-8 rounded-lg"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 text-xs w-36 border-[#DEDAD0] bg-[#F7F5EF] rounded-lg">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="paid">Lunas (Paid)</SelectItem>
                            <SelectItem value="pending">Menunggu (Pending)</SelectItem>
                            <SelectItem value="failed">Gagal (Failed)</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Organization Filter */}
                    <Select value={orgFilter} onValueChange={setOrgFilter}>
                        <SelectTrigger className="h-8 text-xs w-48 border-[#DEDAD0] bg-[#F7F5EF] rounded-lg">
                            <SelectValue placeholder="Pilih Organisasi" />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                            <SelectItem value="all">Semua Organisasi</SelectItem>
                            {organizations.map((org) => (
                                <SelectItem key={org.id} value={org.id}>
                                    {org.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        size="sm"
                        className="h-8 px-3.5 text-xs font-semibold bg-[#1D6B5A] hover:bg-[#175749] text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Terbitkan Faktur Baru</span>
                    </Button>
                </div>
            </div>

            {/* Global Invoices Table */}
            <div className="rounded-xl border border-[#EDEAE0] bg-white overflow-hidden shadow-xs">
                <table className="w-full text-xs">
                    <thead className="bg-[#F7F5EF] border-b border-[#EDEAE0] text-[#1A1A18] font-semibold">
                        <tr>
                            <th className="text-left px-4 py-3">No. Faktur</th>
                            <th className="text-left px-4 py-3">Organisasi Klien</th>
                            <th className="text-left px-4 py-3">Paket</th>
                            <th className="text-left px-4 py-3">Nominal Tagihan</th>
                            <th className="text-left px-4 py-3">Metode Bayar</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Tanggal Terbit</th>
                            <th className="text-right px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEAE0]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-xs text-[#7A7A72]">
                                    Memuat data faktur global dari database...
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-xs text-[#7A7A72]">
                                    Tidak ada data faktur yang sesuai dengan filter pencarian.
                                </td>
                            </tr>
                        ) : (
                            items.map((inv) => {
                                const planBadge = PLAN_BADGES[inv.plan.toLowerCase()] || PLAN_BADGES.pro;
                                return (
                                    <tr key={inv.id} className="hover:bg-[#FDFCF9] transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-[#1A1A18]">
                                            {inv.invoiceNumber}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-[#1A1A18]">{inv.companyName}</p>
                                            <p className="text-[10px] text-[#7A7A72]">{inv.industry || "Logistics"}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                                style={{ backgroundColor: planBadge.bg, color: planBadge.text }}
                                            >
                                                {inv.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-[#1A1A18]">{inv.amountFormatted}</p>
                                            <p className="text-[10px] text-[#7A7A72]">PPN 11% Termasuk</p>
                                        </td>
                                        <td className="px-4 py-3 text-[#7A7A72]">
                                            {inv.paymentMethod || "Bank Transfer"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                    inv.status === "paid"
                                                        ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                                                        : inv.status === "pending"
                                                        ? "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]"
                                                        : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                                                }`}
                                            >
                                                {inv.status === "paid" ? (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                                                        Lunas
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 text-[#D97706]" />
                                                        Pending
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[#7A7A72]">
                                            {new Date(inv.createdAt).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenViewer(inv)}
                                                    className="h-7 px-2 text-[11px] border-[#DEDAD0] text-[#1D6B5A] hover:bg-[#EEF5F3]"
                                                    title="Lihat & Cetak Faktur Resmi"
                                                >
                                                    <Printer className="w-3 h-3 mr-1" />
                                                    Faktur
                                                </Button>

                                                {inv.status === "pending" && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleMarkAsPaid(inv.id)}
                                                        className="h-7 px-2 text-[11px] bg-[#1D6B5A] hover:bg-[#175749] text-white"
                                                        title="Tandai pembayaran telah lunas"
                                                    >
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Lunas
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <InvoiceViewerDialog
                open={viewerOpen}
                setOpen={setViewerOpen}
                invoice={selectedInvoice}
            />

            <CreateInvoiceDialog
                open={createOpen}
                setOpen={setCreateOpen}
            />
        </div>
    );
}
