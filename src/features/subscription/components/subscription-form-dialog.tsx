"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdatePlan } from "@/features/subscription/hooks/subscription-queries";
import { SubscriptionTypes } from "@/types/features/subscription.type";
import { PLAN_COLOR } from "@/features/subscription/constants/subscription.constants";

interface Props {
    open:        boolean;
    setOpen:     (v: boolean) => void;
    initialData: SubscriptionTypes.Service.PlanData;
}

export function SubscriptionFormDialog({ open, setOpen, initialData }: Props) {
    const updateMutation = useUpdatePlan();
    const isLoading = updateMutation.isPending;
    const color = (initialData?.key && PLAN_COLOR[initialData.key]) || { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" };

    const [form, setForm] = useState({
        name:         initialData?.name || "",
        description:  initialData?.description || "",
        maxAssets:    String(initialData?.maxAssets || 10),
        maxUsers:     String(initialData?.maxUsers || 5),
        priceMonthly: String(initialData?.priceMonthly || 0),
        priceYearly:  String(initialData?.priceYearly || 0),
        isActive:     initialData?.isActive ?? true,
        features:     (initialData?.features || []).map((f) => ({ ...f })),
    });

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name:         initialData.name || "",
                description:  initialData.description || "",
                maxAssets:    String(initialData.maxAssets || 10),
                maxUsers:     String(initialData.maxUsers || 5),
                priceMonthly: String(initialData.priceMonthly || 0),
                priceYearly:  String(initialData.priceYearly || 0),
                isActive:     initialData.isActive ?? true,
                features:     (initialData.features || []).map((f) => ({ ...f })),
            });
            setErrors({});
        }
    }, [open, initialData]);

    const setField = (key: string) => (val: string | boolean) =>
        setForm((f) => ({ ...f, [key]: val }));

    const toggleFeature = (featureKey: string) => {
        setForm((f) => ({
            ...f,
            features: f.features.map((feat) =>
                feat.key === featureKey ? { ...feat, enabled: !feat.enabled } : feat
            ),
        }));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim())                                                   e.name         = "Nama wajib diisi.";
        if (isNaN(Number(form.maxAssets))  || Number(form.maxAssets)  < 0)      e.maxAssets    = "Nilai tidak valid.";
        if (isNaN(Number(form.maxUsers))   || Number(form.maxUsers)   < 0)      e.maxUsers     = "Nilai tidak valid.";
        if (isNaN(Number(form.priceMonthly)) || Number(form.priceMonthly) < 0)  e.priceMonthly = "Nilai tidak valid.";
        if (isNaN(Number(form.priceYearly))  || Number(form.priceYearly)  < 0)  e.priceYearly  = "Nilai tidak valid.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const payload: SubscriptionTypes.Service.UpdatePlanRequest = {
            name:         form.name.trim(),
            description:  form.description.trim(),
            maxAssets:    Number(form.maxAssets),
            maxUsers:     Number(form.maxUsers),
            priceMonthly: Number(form.priceMonthly),
            priceYearly:  Number(form.priceYearly),
            isActive:     form.isActive,
            features:     form.features,
        };
        updateMutation.mutate({ id: initialData.id, payload }, { onSuccess: () => setOpen(false) });
    };

    const fieldClass = (key: string) =>
        `border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    const formatPrice = (val: string) =>
        Number(val) === 0
            ? "Gratis"
            : `Rp ${Number(val).toLocaleString("id-ID")}`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] flex flex-col overflow-hidden max-h-[90vh] p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                        >
                            {initialData.name}
                        </span>
                        <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                            Edit Plan
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1 max-h-[65vh] overflow-y-auto pr-2">

                    {/* Nama Plan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama Plan <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.name}
                            onChange={(e) => setField("name")(e.target.value)}
                            className={fieldClass("name")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.name && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.name}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Status</Label>
                        <Select
                            value={form.isActive ? "true" : "false"}
                            onValueChange={(v) => setField("isActive")(v === "true")}
                        >
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Aktif</SelectItem>
                                <SelectItem value="false">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Deskripsi */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Deskripsi</Label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setField("description")(e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-[#DEDAD0] px-3 py-2 text-sm outline-none resize-none focus:border-[#1D6B5A] transition-colors"
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    {/* Maks. Aset */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Maks. Aset <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="number"
                            min="0"
                            value={form.maxAssets}
                            onChange={(e) => setField("maxAssets")(e.target.value)}
                            className={fieldClass("maxAssets")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.maxAssets && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.maxAssets}</p>}
                    </div>

                    {/* Maks. User */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Maks. User <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="number"
                            min="0"
                            value={form.maxUsers}
                            onChange={(e) => setField("maxUsers")(e.target.value)}
                            className={fieldClass("maxUsers")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.maxUsers && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.maxUsers}</p>}
                    </div>

                    {/* Harga Bulanan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Harga Bulanan (Rp) <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="number"
                            min="0"
                            step="1000"
                            value={form.priceMonthly}
                            onChange={(e) => setField("priceMonthly")(e.target.value)}
                            className={fieldClass("priceMonthly")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        <p className="text-[11px]" style={{ color: "#7A7A72" }}>
                            Preview: {formatPrice(form.priceMonthly)}/bulan
                        </p>
                        {errors.priceMonthly && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.priceMonthly}</p>}
                    </div>

                    {/* Harga Tahunan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Harga Tahunan (Rp) <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="number"
                            min="0"
                            step="1000"
                            value={form.priceYearly}
                            onChange={(e) => setField("priceYearly")(e.target.value)}
                            className={fieldClass("priceYearly")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        <p className="text-[11px]" style={{ color: "#7A7A72" }}>
                            Preview: {formatPrice(form.priceYearly)}/tahun
                        </p>
                        {errors.priceYearly && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.priceYearly}</p>}
                    </div>

                    {/* Fitur — 2 kolom grid */}
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Fitur</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {form.features.map((feat) => (
                                <label
                                    key={feat.key}
                                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-[#F7F5EF] rounded-md border border-[#DEDAD0]"
                                >
                                    <div
                                        onClick={() => toggleFeature(feat.key)}
                                        className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors cursor-pointer"
                                        style={{ background: feat.enabled ? "#1D6B5A" : "#D1D5DB" }}
                                    >
                                        <span
                                            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                            style={{ transform: feat.enabled ? "translateX(16px)" : "translateX(0)" }}
                                        />
                                    </div>
                                    <span className="text-sm flex-1" style={{ color: feat.enabled ? "#1A1A18" : "#7A7A72" }}>
                                        {feat.label}
                                    </span>
                                    {feat.enabled && (
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "#eef5f3", color: "#1D6B5A" }}>
                                            Aktif
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="text-sm"
                        style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="text-sm font-medium"
                        style={{ background: "#1D6B5A", color: "#F7F5EF" }}
                    >
                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}