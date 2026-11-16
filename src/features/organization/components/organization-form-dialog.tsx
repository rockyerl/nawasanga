"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrganization, useUpdateOrganization } from "@/features/organization/hooks/organization-queries";
import { OrganizationTypes } from "@/types/features/organization.type";
import { INDUSTRY_LABEL, PLAN_LABEL, PLAN_MAX_ASSETS } from "@/features/organization/constants/organization.constants";
import { MapPin, Crosshair, Sparkles, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

// Dynamically import Leaflet Map to ensure zero SSR conflicts in Next.js Turbopack
const OrganizationLocationMap = dynamic(
    () => import("./organization-location-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-64 sm:h-72 w-full rounded-xl bg-[#F7F5EF] flex items-center justify-center border border-[#EDEAE0] animate-pulse">
                <span className="text-xs text-[#7A7A72]">Memuat peta geospasial interaktif...</span>
            </div>
        ),
    }
);

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
    latitude:               -6.2088 as number | null,
    longitude:              106.8456 as number | null,
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
    const [autoFilled, setAutoFilled] = useState(false);
    const [isFocusingMap, setIsFocusingMap] = useState(false);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name:                  initialData.name,
                industry:              initialData.industry,
                npwp:                  initialData.npwp ?? "",
                address:               initialData.address,
                city:                  initialData.city,
                province:              initialData.province,
                latitude:              initialData.latitude ?? -6.2088,
                longitude:             initialData.longitude ?? 106.8456,
                subscriptionPlan:      initialData.subscriptionPlan,
                subscriptionExpiresAt: initialData.subscriptionExpiresAt
                    ? initialData.subscriptionExpiresAt.slice(0, 10)
                    : "",
                maxAssets:             String(initialData.maxAssets),
                timezone:              initialData.timezone,
                logoUrl:               initialData.logoUrl ?? "",
                isActive:              initialData.isActive,
            });
            setAutoFilled(true);
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
            setAutoFilled(false);
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string | boolean | number | null) =>
        setForm((f) => ({ ...f, [key]: val }));

    // Auto-set maxAssets when plan changes
    const handlePlanChange = (plan: string) => {
        const p = plan as OrganizationTypes.Service.SubscriptionPlan;
        setForm((f) => ({
            ...f,
            subscriptionPlan: p,
            maxAssets: String(PLAN_MAX_ASSETS[p] || 10),
        }));
    };

    // Forward geocode search to focus map when form inputs are typed
    const searchAndFocusMap = useCallback(async (query: string) => {
        if (!query || query.trim().length < 3) return;
        setIsFocusingMap(true);

        try {
            const res = await fetch(`/api/internal/geocode?action=search&q=${encodeURIComponent(query.trim())}`);
            const json = await res.json();
            if (json.code === 200 && Array.isArray(json.data) && json.data.length > 0) {
                const top = json.data[0];
                setForm((f) => ({
                    ...f,
                    latitude: top.lat,
                    longitude: top.lon,
                }));
            }
        } catch {
            // quiet fallback
        } finally {
            setIsFocusingMap(false);
        }
    }, []);

    // Handle form changes for city/province/address with debounced map focus
    const handleLocationInputChange = (field: "address" | "city" | "province", value: string) => {
        setForm((f) => {
            const updated = { ...f, [field]: value };

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                const q = [updated.address, updated.city, updated.province].filter(Boolean).join(" ");
                if (q.trim().length >= 3) {
                    searchAndFocusMap(q);
                }
            }, 750);

            return updated;
        });

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    // Callback when map is clicked / marker is tagged or dragged
    const handleMapLocationSelect = useCallback(
        (data: {
            lat: number;
            lng: number;
            address: string;
            city: string;
            province: string;
            postalCode?: string;
        }) => {
            setForm((f) => ({
                ...f,
                latitude: data.lat,
                longitude: data.lng,
                address: data.address || f.address,
                city: data.city || f.city,
                province: data.province || f.province,
            }));
            setAutoFilled(true);
            setErrors((prev) => ({
                ...prev,
                address: undefined,
                city: undefined,
                province: undefined,
            }));
        },
        []
    );

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
            latitude:              form.latitude,
            longitude:             form.longitude,
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
        `border text-sm outline-none rounded-lg px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500 bg-red-50/20"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[92vh] flex flex-col p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-base font-semibold text-[#1A1A18] flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#1D6B5A]" />
                                {isEdit ? "Edit Organisasi" : "Tambah Organisasi Baru"}
                            </DialogTitle>
                            <p className="text-xs text-[#7A7A72] mt-0.5">
                                Klik titik pada peta untuk auto-fill alamat, atau ubah form untuk memfokuskan peta secara dinamis.
                            </p>
                        </div>
                        {autoFilled && (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEF5F3] text-[#1D6B5A] border border-[#A2CFC5]">
                                <Sparkles className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                <span>Sinkronisasi Peta Aktif</span>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
                    {/* Geospatial Map Section */}
                    <div className="rounded-xl border border-[#EDEAE0] bg-white p-3.5 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#1D6B5A]" />
                                <Label className="text-xs font-semibold text-[#1A1A18]">
                                    Peta Lokasi & Geotagging Kantor
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const q = [form.address, form.city, form.province].filter(Boolean).join(" ");
                                        searchAndFocusMap(q);
                                    }}
                                    disabled={isFocusingMap}
                                    className="text-[11px] text-[#1D6B5A] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                                    title="Fokuskan peta ke alamat dan kota yang diketik"
                                >
                                    <Crosshair className={`w-3.5 h-3.5 ${isFocusingMap ? "animate-spin text-[#C9A040]" : ""}`} />
                                    <span>Fokuskan ke Alamat Form</span>
                                </button>
                            </div>
                        </div>

                        <OrganizationLocationMap
                            latitude={form.latitude}
                            longitude={form.longitude}
                            address={form.address}
                            city={form.city}
                            province={form.province}
                            onLocationSelect={handleMapLocationSelect}
                        />
                    </div>

                    {/* Form Input Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kolom 1: Profil Perusahaan & Geografis */}
                        <div className="space-y-3 rounded-xl border border-[#EDEAE0] bg-white p-3.5 shadow-xs">
                            <h4 className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5 pb-1 border-b border-[#F0EFEA]">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Profil & Alamat Organisasi
                            </h4>

                            {/* Nama Perusahaan */}
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#1A1A18]">
                                    Nama Perusahaan <span className="text-[#C14B2A]">*</span>
                                </Label>
                                <input
                                    value={form.name}
                                    onChange={(e) => set("name")(e.target.value)}
                                    placeholder="PT Sinergi Logistik Nusantara"
                                    className={fieldClass("name")}
                                    style={{ background: "#F7F5EF", color: "#1A1A18" }}
                                />
                                {errors.name && <p className="text-[11px] text-[#C14B2A]">{errors.name}</p>}
                            </div>

                            {/* Industri & NPWP Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Industri <span className="text-[#C14B2A]">*</span>
                                    </Label>
                                    <Select value={form.industry} onValueChange={set("industry")}>
                                        <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                            <SelectValue placeholder="Pilih industri" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDUSTRIES.map((i) => (
                                                <SelectItem key={i} value={i}>{INDUSTRY_LABEL[i]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && <p className="text-[11px] text-[#C14B2A]">{errors.industry}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        NPWP <span className="text-[10px] text-[#7A7A72]">(opsional)</span>
                                    </Label>
                                    <input
                                        value={form.npwp}
                                        onChange={(e) => set("npwp")(e.target.value)}
                                        placeholder="01.234.567.8-091.000"
                                        className={fieldClass("npwp")}
                                        style={{ background: "#F7F5EF", color: "#1A1A18" }}
                                    />
                                </div>
                            </div>

                            {/* Alamat Lengkap (Auto-filled by Map or custom typed) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Alamat Lengkap <span className="text-[#C14B2A]">*</span>
                                    </Label>
                                    {autoFilled && (
                                        <span className="text-[10px] text-[#2A9478] font-medium flex items-center gap-0.5">
                                            <CheckCircle2 className="w-3 h-3" /> Auto-filled
                                        </span>
                                    )}
                                </div>
                                <textarea
                                    value={form.address}
                                    onChange={(e) => handleLocationInputChange("address", e.target.value)}
                                    placeholder="Jl. Raya Cakung No. 88, Kawasan Industri Pulogadung"
                                    rows={2}
                                    className={`w-full rounded-lg border border-[#DEDAD0] px-3 py-2 text-sm outline-none resize-none focus:border-[#1D6B5A] transition-colors ${
                                        errors.address ? "border-red-400 bg-red-50/20" : ""
                                    }`}
                                    style={{ background: "#F7F5EF", color: "#1A1A18" }}
                                />
                                {errors.address && <p className="text-[11px] text-[#C14B2A]">{errors.address}</p>}
                            </div>

                            {/* Kota & Provinsi (Auto-filled by Map or custom typed) */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Kota <span className="text-[#C14B2A]">*</span>
                                    </Label>
                                    <input
                                        value={form.city}
                                        onChange={(e) => handleLocationInputChange("city", e.target.value)}
                                        placeholder="Jakarta Pusat"
                                        className={fieldClass("city")}
                                        style={{ background: "#F7F5EF", color: "#1A1A18" }}
                                    />
                                    {errors.city && <p className="text-[11px] text-[#C14B2A]">{errors.city}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Provinsi <span className="text-[#C14B2A]">*</span>
                                    </Label>
                                    <input
                                        value={form.province}
                                        onChange={(e) => handleLocationInputChange("province", e.target.value)}
                                        placeholder="DKI Jakarta"
                                        className={fieldClass("province")}
                                        style={{ background: "#F7F5EF", color: "#1A1A18" }}
                                    />
                                    {errors.province && <p className="text-[11px] text-[#C14B2A]">{errors.province}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Kolom 2: Paket Langganan & Detail Sistem */}
                        <div className="space-y-3 rounded-xl border border-[#EDEAE0] bg-white p-3.5 shadow-xs">
                            <h4 className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5 pb-1 border-b border-[#F0EFEA]">
                                <Sparkles className="w-3.5 h-3.5 text-[#C9A040]" />
                                Paket Langganan & Konfigurasi
                            </h4>

                            {/* Subscription Plan & Expired At */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">Subscription Plan</Label>
                                    <Select value={form.subscriptionPlan} onValueChange={handlePlanChange}>
                                        <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PLANS.map((p) => (
                                                <SelectItem key={p} value={p}>{PLAN_LABEL[p]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Tanggal Expired <span className="text-[10px] text-[#7A7A72]">(opsional)</span>
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

                            {/* Maks. Aset & Timezone */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">
                                        Maks. Aset <span className="text-[#C14B2A]">*</span>
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
                                    {errors.maxAssets && <p className="text-[11px] text-[#C14B2A]">{errors.maxAssets}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-[#1A1A18]">Timezone</Label>
                                    <Select value={form.timezone} onValueChange={set("timezone")}>
                                        <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIMEZONES.map((tz) => (
                                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Status Organisasi */}
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#1A1A18]">Status Organisasi</Label>
                                <Select
                                    value={form.isActive ? "true" : "false"}
                                    onValueChange={(v) => set("isActive")(v === "true")}
                                >
                                    <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Aktif (Operasional)</SelectItem>
                                        <SelectItem value="false">Nonaktif (Suspend)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Logo URL */}
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#1A1A18]">
                                    URL Logo <span className="text-[10px] text-[#7A7A72]">(opsional)</span>
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
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#EDEAE0]">
                    <div className="text-[11px] text-[#7A7A72] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1D6B5A]" />
                        <span>Koordinat: {form.latitude != null ? form.latitude.toFixed(5) : "-"}, {form.longitude != null ? form.longitude.toFixed(5) : "-"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="text-xs rounded-lg px-4 border-[#DEDAD0] text-[#7A7A72] hover:bg-[#F7F5EF]"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="text-xs font-semibold rounded-lg px-5 bg-[#1D6B5A] hover:bg-[#175749] text-[#F7F5EF] shadow-sm"
                        >
                            {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Daftarkan Organisasi"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
