"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketingTypes } from "@/types/features/ticketing.type";
import { STATUS_LABEL } from "@/lib/mock-data/ticketing.mock";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: TicketingTypes.Service.TicketData;
}

const STATUSES: TicketingTypes.Service.TicketStatus[] = ["baru", "on progress", "selesai"];

const emptyForm = {
    organizationName: "",
    customerName: "",
    reportType: "",
    reportDetail: "",
    status: "baru" as TicketingTypes.Service.TicketStatus,
};

export function TicketingFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open && initialData) {
            setForm({
                organizationName: initialData.organizationName,
                customerName: initialData.customerName,
                reportType: initialData.reportType,
                reportDetail: initialData.reportDetail,
                status: initialData.status,
            });
        } else if (open) {
            setForm(emptyForm);
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const fieldClass = "border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors border-[#DEDAD0] focus:border-[#1D6B5A]";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Update Tiket" : "Buat Tiket Baru"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium">Nama PT <span style={{ color: "#C14B2A" }}>*</span></Label>
                        <input value={form.organizationName} onChange={(e) => set("organizationName")(e.target.value)} className={fieldClass} style={{ background: "#F7F5EF" }} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Customer <span style={{ color: "#C14B2A" }}>*</span></Label>
                        <input value={form.customerName} onChange={(e) => set("customerName")(e.target.value)} className={fieldClass} style={{ background: "#F7F5EF" }} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Jenis Laporan</Label>
                        <input value={form.reportType} onChange={(e) => set("reportType")(e.target.value)} className={fieldClass} style={{ background: "#F7F5EF" }} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium">Detail Laporan</Label>
                        <textarea value={form.reportDetail} onChange={(e) => set("reportDetail")(e.target.value)} rows={4} className={fieldClass} style={{ background: "#F7F5EF", resize: "none" }} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium">Status</Label>
                        <Select value={form.status} onValueChange={set("status")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button variant="outline" onClick={() => setOpen(false)} style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}>Batal</Button>
                    <Button onClick={() => setOpen(false)} style={{ background: "#1D6B5A", color: "#F7F5EF" }}>
                        {isEdit ? "Simpan Perubahan" : "Terima Tiket"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}