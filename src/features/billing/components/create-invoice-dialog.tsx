"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganizations } from "@/features/organization/hooks/organization-queries";
import { useCreateInvoice } from "@/features/billing/hooks/use-billing-queries";
import { FileText, Building2, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import type { OrganizationTypes } from "@/types/features/organization.type";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
}

const PRESET_AMOUNTS = [
    { label: "Starter (Bln)", amount: 799000 },
    { label: "Starter (Thn)", amount: 7990000 },
    { label: "Pro (Thn)", amount: 15000000 },
    { label: "Enterprise (Thn)", amount: 45000000 },
];

export function CreateInvoiceDialog({ open, setOpen }: Props) {
    const createMutation = useCreateInvoice();
    const { data: orgsData, isLoading: isLoadingOrgs } = useOrganizations({
        page: 1,
        itemPerPage: 100,
    });

    const organizations = useMemo(() => {
        const resp = orgsData?.data as { items?: OrganizationTypes.Service.OrganizationData[] } | undefined;
        return resp?.items || [];
    }, [orgsData]);

    const [organizationId, setOrganizationId] = useState("");
    const [amountIdr, setAmountIdr] = useState("15000000");
    const [paymentMethod, setPaymentMethod] = useState("Bank Transfer BCA");
    const [status, setStatus] = useState<"pending" | "paid">("pending");
    const [error, setError] = useState<string | null>(null);

    const selectedOrg = organizations.find((o) => o.id === organizationId);

    const handleSave = () => {
        if (!organizationId) {
            setError("Pilih organisasi yang ditagih.");
            return;
        }
        if (!amountIdr || Number(amountIdr) <= 0) {
            setError("Masukkan nominal tagihan yang valid.");
            return;
        }

        setError(null);
        createMutation.mutate(
            {
                organizationId,
                amountIdr: Number(amountIdr),
                paymentMethod,
                status,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setOrganizationId("");
                    setAmountIdr("15000000");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg p-6 bg-white border border-[#EDEAE0]">
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-base font-semibold text-[#1A1A18] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1D6B5A]" />
                        Terbitkan Faktur Tagihan Baru
                    </DialogTitle>
                    <p className="text-xs text-[#7A7A72] mt-0.5">
                        Penerbitan faktur tagihan resmi langganan platform bagi klien organisasi terdaftar.
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Organization Selector */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Pilih Organisasi Klien <span className="text-[#C14B2A]">*</span>
                        </Label>
                        <Select value={organizationId} onValueChange={(v) => { setOrganizationId(v); setError(null); }}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder={isLoadingOrgs ? "Memuat organisasi..." : "Pilih organisasi..."} />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                                {organizations.map((org) => (
                                    <SelectItem key={org.id} value={org.id}>
                                        <div className="flex items-center justify-between gap-3 w-full">
                                            <span className="font-semibold text-[#1A1A18]">{org.name}</span>
                                            <span className="text-[11px] text-[#7A7A72]">
                                                ({org.industry || "Logistik"} • Paket: {org.subscriptionPlan || "Starter"})
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedOrg && (
                            <p className="text-[11px] text-[#1D6B5A] font-medium flex items-center gap-1 mt-1">
                                <CheckCircle2 className="w-3 h-3" /> Ditujukan kepada: {selectedOrg.name} ({selectedOrg.city || "Jakarta"})
                            </p>
                        )}
                    </div>

                    {/* Amount & Presets */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                            <Banknote className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Nominal Tagihan (IDR) <span className="text-[#C14B2A]">*</span>
                        </Label>
                        <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={amountIdr}
                            onChange={(e) => setAmountIdr(e.target.value)}
                            placeholder="15000000"
                            className="w-full rounded-lg border border-[#DEDAD0] px-3 py-2 text-sm outline-none focus:border-[#1D6B5A] font-semibold"
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {PRESET_AMOUNTS.map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setAmountIdr(String(p.amount))}
                                    className="text-[10px] px-2.5 py-1 rounded-md border border-[#DEDAD0] bg-[#F7F5EF] text-[#1A1A18] hover:border-[#1D6B5A] hover:bg-[#EEF5F3] transition-colors"
                                >
                                    {p.label}: Rp {(p.amount / 1000000).toFixed(1)}jt
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method & Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Metode Pembayaran
                            </Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bank Transfer BCA">Bank Transfer BCA</SelectItem>
                                    <SelectItem value="Mandiri Virtual Account">Mandiri Virtual Account</SelectItem>
                                    <SelectItem value="BNI Corporate Account">BNI Corporate Account</SelectItem>
                                    <SelectItem value="QRIS Dinamis">QRIS Dinamis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18]">Status Awal Faktur</Label>
                            <Select value={status} onValueChange={(v: "pending" | "paid") => setStatus(v)}>
                                <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                                    <SelectItem value="paid">Lunas (Sudah Dibayar)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && <p className="text-xs text-[#C14B2A]">{error}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEAE0]">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="text-xs rounded-lg px-4 border-[#DEDAD0] text-[#7A7A72]"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={createMutation.isPending}
                        className="text-xs font-semibold rounded-lg px-5 bg-[#1D6B5A] hover:bg-[#175749] text-white"
                    >
                        {createMutation.isPending ? "Menerbitkan..." : "Terbitkan Faktur"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
