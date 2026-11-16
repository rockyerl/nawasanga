"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketingTypes } from "@/types/features/ticketing.type";
import { STATUS_LABEL } from "@/features/ticketing/constants/ticketing.constants";
import { useCreateTicket, useUpdateTicket } from "@/features/ticketing/hooks/ticketing-queries";
import { Building2, User, FileQuestion, HelpCircle, CheckCircle2, Lock } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: TicketingTypes.Service.TicketData;
}

const STATUSES: TicketingTypes.Service.TicketStatus[] = ["baru", "on progress", "selesai"];

const REPORT_TYPES = [
    "Integrasi Sensor & Telematika GPS",
    "Kendala Input Log Konsumsi BBM",
    "Permintaan Laporan Emisi Kepatuhan (SRN-PPI)",
    "Penyesuaian Kuota & Penambahan Armada",
    "Kendala Akses Akun & Hak Akses",
    "Lainnya",
];

const emptyForm = {
    organizationName: "",
    organizationId:   "",
    customerName:     "",
    reportType:       "Integrasi Sensor & Telematika GPS",
    reportDetail:     "",
    priority:         "medium" as "low" | "medium" | "high",
    status:           "baru" as TicketingTypes.Service.TicketStatus,
};

export function TicketingFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const [form, setForm] = useState(emptyForm);
    const [isClientUser, setIsClientUser] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const createMutation = useCreateTicket();
    const updateMutation = useUpdateTicket();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    // Auto-fetch logged-in user & organization info
    useEffect(() => {
        if (!open) return;

        if (initialData) {
            setForm({
                organizationName: initialData.organizationName,
                organizationId:   "",
                customerName:     initialData.customerName,
                reportType:       initialData.reportType,
                reportDetail:     initialData.reportDetail,
                priority:         "medium",
                status:           initialData.status,
            });
            return;
        }

        // Fetch session
        setIsLoadingUser(true);
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200 && data.user) {
                    const u = data.user;
                    const orgName = u.organizationName || (u.organizationId ? "PT Nusantara Logistik Makmur" : "");
                    setForm({
                        organizationName: orgName,
                        organizationId:   u.organizationId || "",
                        customerName:     u.name || "",
                        reportType:       "Integrasi Sensor & Telematika GPS",
                        reportDetail:     "",
                        priority:         "medium",
                        status:           "baru",
                    });
                    if (u.roleCode !== "SUPERADMIN") {
                        setIsClientUser(true);
                    }
                }
            })
            .catch(() => {})
            .finally(() => setIsLoadingUser(false));
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const handleSave = () => {
        if (!form.organizationName.trim() || !form.customerName.trim() || !form.reportDetail.trim()) {
            return;
        }

        const payload = {
            organizationId: form.organizationId,
            organizationName: form.organizationName.trim(),
            customerName: form.customerName.trim(),
            subject: form.reportType,
            reportType: form.reportType,
            description: form.reportDetail.trim(),
            reportDetail: form.reportDetail.trim(),
            priority: form.priority,
            status: form.status,
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                { onSuccess: () => setOpen(false) }
            );
        } else {
            createMutation.mutate(payload, { onSuccess: () => setOpen(false) });
        }
    };

    const fieldClass = "border text-xs outline-none rounded-lg px-3 py-2 w-full transition-colors border-[#DEDAD0] focus:border-[#1D6B5A]";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg p-6 bg-white border border-[#EDEAE0]">
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-base font-semibold text-[#1A1A18] flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-[#1D6B5A]" />
                        {isEdit ? "Update Tiket Bantuan" : "Buat Tiket Bantuan Baru"}
                    </DialogTitle>
                    <p className="text-xs text-[#7A7A72] mt-0.5">
                        Ajukan permohonan dukungan teknis, kendala input data, atau pertanyaan integrasi telematika.
                    </p>
                </DialogHeader>

                <div className="space-y-3.5 py-2">
                    {/* Nama Organisasi (Auto-filled by Login Session) */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Nama Organisasi / PT <span className="text-[#C14B2A]">*</span>
                            </Label>
                            {form.organizationName && (
                                <span className="text-[10px] text-[#2A9478] font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Terisi dari Sesi Login
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                value={form.organizationName}
                                onChange={(e) => set("organizationName")(e.target.value)}
                                disabled={isClientUser}
                                placeholder="PT Sinergi Logistik Nusantara"
                                className={`${fieldClass} ${isClientUser ? "bg-[#EDEAE0]/40 text-[#4A4A45] cursor-not-allowed" : "bg-[#F7F5EF] text-[#1A1A18]"}`}
                            />
                            {isClientUser && (
                                <Lock className="w-3.5 h-3.5 text-[#7A7A72] absolute right-3 top-2.5" />
                            )}
                        </div>
                    </div>

                    {/* Customer Name & Priority */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Nama Pengaju (PIC) <span className="text-[#C14B2A]">*</span>
                            </Label>
                            <input
                                value={form.customerName}
                                onChange={(e) => set("customerName")(e.target.value)}
                                placeholder="Nama lengkap Anda"
                                className={fieldClass}
                                style={{ background: "#F7F5EF", color: "#1A1A18" }}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-[#1A1A18]">Prioritas</Label>
                            <Select value={form.priority} onValueChange={(v: "low" | "medium" | "high") => set("priority")(v)}>
                                <SelectTrigger className="border-[#DEDAD0] text-xs h-8 rounded-lg" style={{ background: "#F7F5EF" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Rendah (Pertanyaan Umum)</SelectItem>
                                    <SelectItem value="medium">Sedang (Kendala Operasional)</SelectItem>
                                    <SelectItem value="high">Tinggi (Kritis / Gangguan Sistem)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Jenis Laporan */}
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                            <FileQuestion className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Kategori Masalah / Jenis Laporan
                        </Label>
                        <Select value={form.reportType} onValueChange={set("reportType")}>
                            <SelectTrigger className="border-[#DEDAD0] text-xs rounded-lg" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_TYPES.map((rt) => (
                                    <SelectItem key={rt} value={rt}>
                                        {rt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Detail Laporan */}
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-[#1A1A18]">
                            Deskripsi Rinci Kendala <span className="text-[#C14B2A]">*</span>
                        </Label>
                        <textarea
                            value={form.reportDetail}
                            onChange={(e) => set("reportDetail")(e.target.value)}
                            placeholder="Jelaskan kendala teknis atau pertanyaan secara detail..."
                            rows={3}
                            className={`${fieldClass} resize-none`}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    {/* Status (Visible for Superadmin or edit) */}
                    {isEdit && (
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-[#1A1A18]">Status Penanganan</Label>
                            <Select value={form.status} onValueChange={set("status")}>
                                <SelectTrigger className="border-[#DEDAD0] text-xs h-8 rounded-lg" style={{ background: "#F7F5EF" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
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
                        disabled={isLoading || !form.organizationName || !form.reportDetail}
                        className="text-xs font-semibold rounded-lg px-5 bg-[#1D6B5A] hover:bg-[#175749] text-white shadow-xs"
                    >
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Ajukan Tiket"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
