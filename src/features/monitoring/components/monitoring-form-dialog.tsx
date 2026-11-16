"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCreateAccount, useUpdateAccount } from "@/features/account/hooks/account-queries";
import { AccountTypes } from "@/types/features/account.type";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: AccountTypes.Service.AccountData;
}

const emptyForm = {
    companyName: "",
    picName: "",
    position: "",
    email: "",
};

export function MonitoringFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                companyName: initialData.companyName,
                picName: initialData.picName,
                position: initialData.position,
                email: initialData.email,
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
        if (!form.companyName.trim()) e.companyName = "Nama perusahaan wajib diisi.";
        if (!form.picName.trim()) e.picName = "Nama penanggung jawab wajib diisi.";
        if (!form.position.trim()) e.position = "Posisi wajib diisi.";
        if (!form.email.trim()) e.email = "Email wajib diisi.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const payload = {
            companyName: form.companyName.trim(),
            picName: form.picName.trim(),
            position: form.position.trim(),
            email: form.email.trim(),
            subscriptionPlan: (initialData as any)?.subscriptionPlan ?? "FREE",
            status: (initialData as any)?.status ?? "ACTIVE",
        };

        if (isEdit && initialData) {
            updateMutation.mutate({ id: initialData.id, payload: payload as any }, { onSuccess: () => setOpen(false) });
        } else {
            createMutation.mutate(payload as any, { onSuccess: () => setOpen(false) });
        }
    };

    const fieldClass = (key: keyof typeof emptyForm) =>
        `border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Edit Akun" : "Tambah Akun"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama Perusahaan <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.companyName}
                            onChange={(e) => set("companyName")(e.target.value)}
                            placeholder="PT Sinergi Logistik Nusantara"
                            className={fieldClass("companyName")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.companyName && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.companyName}</p>}
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Penanggung Jawab <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.picName}
                            onChange={(e) => set("picName")(e.target.value)}
                            placeholder="Ahmad Fauzi"
                            className={fieldClass("picName")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.picName && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.picName}</p>}
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Posisi <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.position}
                            onChange={(e) => set("position")(e.target.value)}
                            placeholder="Manager Logistik"
                            className={fieldClass("position")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.position && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.position}</p>}
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Email <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => set("email")(e.target.value)}
                            placeholder="penanggung@perusahaan.com"
                            className={fieldClass("email")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.email && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.email}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="text-sm" style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}>
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="text-sm font-medium" style={{ background: "#1D6B5A", color: "#F7F5EF" }}>
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}