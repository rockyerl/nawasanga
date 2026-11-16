"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAccount, useUpdateAccount } from "@/features/account/hooks/account-queries";
import { useOrganizations } from "@/features/organization/hooks/organization-queries";
import { AccountTypes } from "@/types/features/account.type";
import type { OrganizationTypes } from "@/types/features/organization.type";
import { Building2, UserCheck, ShieldCheck, Mail, Lock, Briefcase, CheckCircle2 } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: AccountTypes.Service.AccountData;
}

const COMMON_POSITIONS = [
    "Fleet Operations Manager",
    "Direktur Operasional",
    "Head of Logistics & Supply Chain",
    "Branch / Depot Manager",
    "HSE & Emission Officer",
    "Fleet Maintenance Supervisor",
];

const emptyForm = {
    organizationId: "",
    companyName:    "",
    picName:        "",
    position:       "Fleet Operations Manager",
    email:          "",
    password:       "",
    status:         "active" as "active" | "inactive",
};

export function AccountFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    // Fetch existing organizations for the dropdown
    const { data: orgsData, isLoading: isLoadingOrgs } = useOrganizations({
        page: 1,
        itemPerPage: 100,
    });

    const organizationsList = useMemo(() => {
        const resp = orgsData?.data as { items?: OrganizationTypes.Service.OrganizationData[] } | undefined;
        return resp?.items || [];
    }, [orgsData]);

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    // Selected organization details
    const selectedOrg = useMemo(() => {
        if (!form.organizationId) return null;
        return organizationsList.find((o) => o.id === form.organizationId) || null;
    }, [form.organizationId, organizationsList]);

    useEffect(() => {
        if (open && initialData) {
            setForm({
                organizationId: initialData.organizationId || initialData.id,
                companyName:    initialData.companyName,
                picName:        initialData.picName,
                position:       initialData.position || "Fleet Operations Manager",
                email:          initialData.email,
                password:       "",
                status:         initialData.status === "inactive" ? "inactive" : "active",
            });
            setErrors({});
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const handleOrgSelect = (orgId: string) => {
        const matched = organizationsList.find((o) => o.id === orgId);
        if (matched) {
            setForm((f) => ({
                ...f,
                organizationId: matched.id,
                companyName:    matched.name,
                email:          f.email || (matched as any).contactEmail || "",
            }));
            setErrors((prev) => ({
                ...prev,
                organizationId: undefined,
                companyName:    undefined,
            }));
        }
    };

    const validate = () => {
        const e: typeof errors = {};
        if (!form.organizationId && !form.companyName.trim()) {
            e.organizationId = "Pilih organisasi yang terdaftar.";
        }
        if (!form.picName.trim()) {
            e.picName = "Nama penanggung jawab wajib diisi.";
        }
        if (!form.position.trim()) {
            e.position = "Posisi / jabatan wajib diisi.";
        }
        if (!form.email.trim() || !form.email.includes("@")) {
            e.email = "Email valid wajib diisi untuk kredensial login.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const payload = {
            organizationId: form.organizationId,
            companyName:    form.companyName.trim(),
            picName:        form.picName.trim(),
            position:       form.position.trim(),
            email:          form.email.trim().toLowerCase(),
            password:       form.password.trim() || undefined,
            status:         form.status,
            subscriptionPlan: (selectedOrg?.subscriptionPlan || (initialData as any)?.subscriptionPlan || "starter").toLowerCase(),
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload: payload as any },
                { onSuccess: () => setOpen(false) }
            );
        } else {
            createMutation.mutate(payload as any, { onSuccess: () => setOpen(false) });
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
            <DialogContent className="sm:max-w-xl p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-base font-semibold text-[#1A1A18] flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-[#1D6B5A]" />
                        {isEdit ? "Edit Akun PIC Perusahaan" : "Tambah Akun PIC Perusahaan"}
                    </DialogTitle>
                    <p className="text-xs text-[#7A7A72] mt-0.5">
                        Pilih organisasi perusahaan yang sudah terdaftar, lalu daftarkan penanggung jawab (PIC) untuk akses portal klien.
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Dropdown Organisasi Terdaftar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Pilih Organisasi / Perusahaan <span className="text-[#C14B2A]">*</span>
                            </Label>
                            {selectedOrg && (
                                <span className="text-[11px] text-[#2A9478] font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Terpilih
                                </span>
                            )}
                        </div>

                        <Select
                            value={form.organizationId}
                            onValueChange={handleOrgSelect}
                            disabled={isLoadingOrgs}
                        >
                            <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder={isLoadingOrgs ? "Memuat daftar organisasi..." : "Pilih organisasi yang sudah ada..."} />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                                {organizationsList.length === 0 ? (
                                    <div className="p-3 text-xs text-center text-[#7A7A72]">
                                        Tidak ada organisasi terdaftar
                                    </div>
                                ) : (
                                    organizationsList.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            <div className="flex items-center justify-between gap-3 w-full">
                                                <span className="font-semibold text-[#1A1A18]">{org.name}</span>
                                                <span className="text-[11px] text-[#7A7A72]">
                                                    ({org.industry || "Logistik"} • {org.city || "Jakarta"})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.organizationId && (
                            <p className="text-[11px] text-[#C14B2A]">{errors.organizationId}</p>
                        )}

                        {/* Selected Organization Info Card */}
                        {selectedOrg && (
                            <div className="mt-2 rounded-lg bg-[#EEF5F3] border border-[#A2CFC5] p-2.5 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-semibold text-[#1D6B5A]">{selectedOrg.name}</p>
                                    <p className="text-[11px] text-[#175749]">
                                        {selectedOrg.address || selectedOrg.city || "Indonesia"} • Paket: {selectedOrg.subscriptionPlan || "Starter"}
                                    </p>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1D6B5A] text-white">
                                    Terhubung
                                </span>
                            </div>
                        )}
                    </div>

                    {/* PIC & Position Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Nama Penanggung Jawab (PIC) <span className="text-[#C14B2A]">*</span>
                            </Label>
                            <input
                                value={form.picName}
                                onChange={(e) => set("picName")(e.target.value)}
                                placeholder="Budi Santoso"
                                className={fieldClass("picName")}
                                style={{ background: "#F7F5EF", color: "#1A1A18" }}
                            />
                            {errors.picName && <p className="text-[11px] text-[#C14B2A]">{errors.picName}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Posisi / Jabatan <span className="text-[#C14B2A]">*</span>
                            </Label>
                            <input
                                list="position-suggestions"
                                value={form.position}
                                onChange={(e) => set("position")(e.target.value)}
                                placeholder="Fleet Operations Manager"
                                className={fieldClass("position")}
                                style={{ background: "#F7F5EF", color: "#1A1A18" }}
                            />
                            <datalist id="position-suggestions">
                                {COMMON_POSITIONS.map((pos) => (
                                    <option key={pos} value={pos} />
                                ))}
                            </datalist>
                            {errors.position && <p className="text-[11px] text-[#C14B2A]">{errors.position}</p>}
                        </div>
                    </div>

                    {/* Email Login & Status Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Email Login Klien <span className="text-[#C14B2A]">*</span>
                            </Label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => set("email")(e.target.value)}
                                placeholder="pic@perusahaan.com"
                                className={fieldClass("email")}
                                style={{ background: "#F7F5EF", color: "#1A1A18" }}
                            />
                            {errors.email && <p className="text-[11px] text-[#C14B2A]">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#1D6B5A]" />
                                Status Akun
                            </Label>
                            <Select value={form.status} onValueChange={(v: "active" | "inactive") => set("status")(v)}>
                                <SelectTrigger className="border-[#DEDAD0] text-sm rounded-lg" style={{ background: "#F7F5EF" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Aktif (Dapat Login)</SelectItem>
                                    <SelectItem value="inactive">Nonaktif (Ditangguhkan)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Password Login
                            <span className="text-[10px] text-[#7A7A72] font-normal">
                                {isEdit ? "(Kosongkan jika tidak ingin mengubah)" : "(Default: Sundawa123! jika dikosongkan)"}
                            </span>
                        </Label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => set("password")(e.target.value)}
                            placeholder={isEdit ? "••••••••" : "Sundawa123!"}
                            className={fieldClass("password")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEAE0]">
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
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Daftarkan Akun PIC"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
