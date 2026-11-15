"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrganization, useUpdateOrganization } from "@/features/organization/hooks/organization-queries";
import { OrganizationTypes } from "@/types/features/organization.type";
import { INDUSTRY_LABEL, PLAN_LABEL, PLAN_MAX_ASSETS } from "@/features/organization/constants/organization.constants";

const INDUSTRIES: OrganizationTypes.Service.Industry[] = [
    "logistics",
    "construction",
    "plantation",
    "mining",
    "corporate",
];

const PLANS: OrganizationTypes.Service.SubscriptionPlan[] = [
    "free",
    "starter",
    "pro",
    "enterprise",
];

const TIMEZONES = [
    "Asia/Jakarta",
    "Asia/Makassar",
    "Asia/Jayapura",
];

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: OrganizationTypes.Service.OrganizationData;
}

const emptyForm = {
    name:                   "",
    industry:               "" as OrganizationTypes.Service.Industry | "",
    npwp:                   "",
    address:                "",
    city:                   "",
    province:               "",
    subscriptionPlan:       "free" as OrganizationTypes.Service.SubscriptionPlan,
    subscriptionExpiresAt:  "",
    maxAssets:              "10",
    timezone:               "Asia/Jakarta",
    logoUrl:                "",
    isActive:               true,
};

export function OrganizationFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateOrganization();
    const updateMutation = useUpdateOrganization();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name:                  initialData.name,
                industry:              initialData.industry,
                npwp:                  initialData.npwp ?? "",
                address:               initialData.address,
                city:                  initialData.city,
                province:              initialData.province,
                subscriptionPlan:      initialData.subscriptionPlan,
                subscriptionExpiresAt: initialData.subscriptionExpiresAt
                    ? initialData.subscriptionExpiresAt.slice(0, 10)
                    : "",
                maxAssets:             String(initialData.maxAssets),
                timezone:              initialData.timezone,
                logoUrl:               initialData.logoUrl ?? "",
                isActive:              initialData.isActive,
            });
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string | boolean) =>
        setForm((f) => ({ ...f, [key]: val }));

    // Auto-set maxAssets when plan changes
    const handlePlanChange = (plan: string) => {
        const p = plan as OrganizationTypes.Service.SubscriptionPlan;
        setForm((f) => ({
            ...f,
            subscriptionPlan: p,
            maxAssets: String(PLAN_MAX_ASSETS[p]),
        }));
    };

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim())     e.name     = "Nama wajib diisi.";
        if (!form.industry)        e.industry  = "Pilih industri.";
        if (!form.address.trim())  e.address   = "Alamat wajib diisi.";
        if (!form.city.trim())     e.city      = "Kota wajib diisi.";
        if (!form.province.trim()) e.province  = "Provinsi wajib diisi.";
        if (!form.maxAssets || isNaN(Number(form.maxAssets)) || Number(form.maxAssets) < 1)
            e.maxAssets = "Masukkan jumlah aset yang valid (≥ 1).";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const payload = {
            name:                  form.name.trim(),
            industry:              form.industry as OrganizationTypes.Service.Industry,
            npwp:                  form.npwp.trim() || null,
            address:               form.address.trim(),
            city:                  form.city.trim(),
            province:              form.province.trim(),
            subscriptionPlan:      form.subscriptionPlan,
            subscriptionExpiresAt: form.subscriptionExpiresAt
                ? new Date(form.subscriptionExpiresAt).toISOString()
                : null,
            maxAssets:             Number(form.maxAssets),
            timezone:              form.timezone,
            logoUrl:               form.logoUrl.trim() || null,
            isActive:              form.isActive,
        };
        if (isEdit && initialData) {
            updateMutation.mutate({ id: initialData.id, payload }, { onSuccess: () => setOpen(false) });
        } else {
            createMutation.mutate(payload, { onSuccess: () => setOpen(false) });
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
            <DialogContent className="sm:max-w-2xl" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Edit Organisasi" : "Tambah Organisasi"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1 max-h-[70vh] overflow-y-auto pr-1">

                    {/* Nama */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama Perusahaan <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.name}
                            onChange={(e) => set("name")(e.target.value)}
                            placeholder="PT Sinergi Logistik Nusantara"
                            className={fieldClass("name")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.name && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.name}</p>}
                    </div>

                    {/* Industri */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Industri <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <Select value={form.industry} onValueChange={set("industry")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder="Pilih industri" />
                            </SelectTrigger>
                            <SelectContent>
                                {INDUSTRIES.map((i) => (
                                    <SelectItem key={i} value={i}>{INDUSTRY_LABEL[i]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.industry && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.industry}</p>}
                    </div>

                    {/* NPWP */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            NPWP
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <input
                            value={form.npwp}
                            onChange={(e) => set("npwp")(e.target.value)}
                            placeholder="01.234.567.8-091.000"
                            className={fieldClass("npwp")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    {/* Alamat */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Alamat Lengkap <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <textarea
                            value={form.address}
                            onChange={(e) => set("address")(e.target.value)}
                            placeholder="Jl. Raya Cakung No. 88, Kawasan Industri Pulogadung"
                            rows={2}
                            className="w-full rounded-md border border-[#DEDAD0] px-3 py-2 text-sm outline-none resize-none focus:border-[#1D6B5A] transition-colors"
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.address && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.address}</p>}
                    </div>

                    {/* Kota */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Kota <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.city}
                            onChange={(e) => set("city")(e.target.value)}
                            placeholder="Jakarta"
                            className={fieldClass("city")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.city && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.city}</p>}
                    </div>

                    {/* Provinsi */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Provinsi <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.province}
                            onChange={(e) => set("province")(e.target.value)}
                            placeholder="DKI Jakarta"
                            className={fieldClass("province")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.province && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.province}</p>}
                    </div>

                    {/* Subscription Plan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Subscription Plan
                        </Label>
                        <Select value={form.subscriptionPlan} onValueChange={handlePlanChange}>
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

                    {/* Expired At */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Tanggal Expired
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <input
                            type="date"
                            value={form.subscriptionExpiresAt}
                            onChange={(e) => set("subscriptionExpiresAt")(e.target.value)}
                            className={fieldClass("subscriptionExpiresAt")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    {/* Maks. Aset */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Maks. Aset <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.maxAssets}
                            onChange={(e) => set("maxAssets")(e.target.value)}
                            type="number"
                            min="1"
                            step="1"
                            placeholder="500"
                            className={fieldClass("maxAssets")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.maxAssets && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.maxAssets}</p>}
                    </div>

                    {/* Timezone */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Timezone</Label>
                        <Select value={form.timezone} onValueChange={set("timezone")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Status</Label>
                        <Select
                            value={form.isActive ? "true" : "false"}
                            onValueChange={(v) => set("isActive")(v === "true")}
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

                    {/* Logo URL */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            URL Logo
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <input
                            value={form.logoUrl}
                            onChange={(e) => set("logoUrl")(e.target.value)}
                            placeholder="https://cdn.example.com/logo.png"
                            className={fieldClass("logoUrl")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
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
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}