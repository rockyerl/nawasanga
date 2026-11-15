"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillingTypes } from "@/types/features/billing.type";
import { PLAN_LABEL } from "@/lib/mock-data/billing.mock";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: BillingTypes.Service.BillingData;
}

const PLANS: BillingTypes.Service.SubscriptionPlan[] = ["free", "starter", "pro", "enterprise"];

const emptyForm = {
    organizationName: "",
    personInCharge: "",
    paymentDate: "",
    subscriptionPlan: "free" as BillingTypes.Service.SubscriptionPlan,
    subscriptionExpiresAt: "",
    amount: "0",
};

export function BillingFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                organizationName: initialData.organizationName,
                personInCharge: initialData.personInCharge,
                paymentDate: initialData.paymentDate.slice(0, 10),
                subscriptionPlan: initialData.subscriptionPlan,
                subscriptionExpiresAt: initialData.subscriptionExpiresAt.slice(0, 10),
                amount: String(initialData.amount),
            });
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.organizationName.trim()) e.organizationName = "Nama PT wajib diisi.";
        if (!form.personInCharge.trim()) e.personInCharge = "Penanggung jawab wajib diisi.";
        if (!form.paymentDate) e.paymentDate = "Pilih tanggal bayar.";
        if (!form.subscriptionExpiresAt) e.subscriptionExpiresAt = "Pilih tanggal expired.";
        if (Number(form.amount) <= 0) e.amount = "Masukkan nominal yang valid.";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        setOpen(false);
    };

    const fieldClass = (key: keyof typeof emptyForm) =>
        `border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Edit Riwayat Billing" : "Tambah Riwayat Billing"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama PT / Organisasi <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.organizationName}
                            onChange={(e) => set("organizationName")(e.target.value)}
                            placeholder="PT Sinergi Logistik Nusantara"
                            className={fieldClass("organizationName")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.organizationName && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.organizationName}</p>}
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Penanggung Jawab <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.personInCharge}
                            onChange={(e) => set("personInCharge")(e.target.value)}
                            placeholder="Nama Lengkap"
                            className={fieldClass("personInCharge")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.personInCharge && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.personInCharge}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Subscription Plan
                        </Label>
                        <Select value={form.subscriptionPlan} onValueChange={set("subscriptionPlan")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PLANS.map((p) => (
                                    <SelectItem key={p} value={p}>{PLAN_LABEL[p]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nominal Bayar <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) => set("amount")(e.target.value)}
                            className={fieldClass("amount")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Tanggal Bayar <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="date"
                            value={form.paymentDate}
                            onChange={(e) => set("paymentDate")(e.target.value)}
                            className={fieldClass("paymentDate")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Tanggal Expired <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="date"
                            value={form.subscriptionExpiresAt}
                            onChange={(e) => set("subscriptionExpiresAt")(e.target.value)}
                            className={fieldClass("subscriptionExpiresAt")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="text-sm"
                        style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="text-sm font-medium"
                        style={{ background: "#1D6B5A", color: "#F7F5EF" }}
                    >
                        {isEdit ? "Simpan Perubahan" : "Tambah"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}