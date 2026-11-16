"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRole, useUpdateRole } from "@/features/role/hooks/role-users-queries";
import type { RoleFormValues } from "@/types/features/role.type";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const SIDEBAR_FEATURES = [
    { label: "Dashboard",       group: null },
    { label: "User",            group: "Pengguna" },
    { label: "Role",            group: "Pengguna" },
    { label: "Driver",          group: "Pengguna" },
    { label: "Lokasi",          group: "Manajemen Aset" },
    { label: "Aset",            group: "Manajemen Aset" },
    { label: "Log BBM",         group: null },
    { label: "Laporan Emisi",   group: null },
    { label: "Billing",         group: null },
];

const GROUPS = [
    { name: null,               features: SIDEBAR_FEATURES.filter((f) => f.group === null) },
    { name: "Pengguna",         features: SIDEBAR_FEATURES.filter((f) => f.group === "Pengguna") },
    { name: "Manajemen Aset",   features: SIDEBAR_FEATURES.filter((f) => f.group === "Manajemen Aset") },
];

interface RoleFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: any;
}

export function RoleFormDialog({ open, setOpen, initialData }: RoleFormDialogProps) {
    const isEdit = !!initialData;
    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState<RoleFormValues>({ roleName: "", permissions: [] });

    useEffect(() => {
        if (open && initialData) {
            setForm({
                roleName: initialData.name || initialData.roleName || "",
                permissions: Array.isArray(initialData.permissions) ? initialData.permissions : [],
            });
        } else if (open && !initialData) {
            setForm({ roleName: "", permissions: [] });
        }
    }, [open, initialData]);

    const handleClose = () => {
        setForm({ roleName: "", permissions: [] });
        setOpen(false);
    };

    const togglePermission = (feature: string) => {
        setForm((prev: RoleFormValues) => ({
            ...prev,
            permissions: prev.permissions.includes(feature)
                ? prev.permissions.filter((p: string) => p !== feature)
                : [...prev.permissions, feature],
        }));
    };

    const toggleGroup = (features: string[]) => {
        const allChecked = features.every((f) => form.permissions.includes(f));
        setForm((prev: RoleFormValues) => ({
            ...prev,
            permissions: allChecked
                ? prev.permissions.filter((p: string) => !features.includes(p))
                : [...new Set([...prev.permissions, ...features])],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.roleName.trim()) {
            toast.error("Nama role wajib diisi.");
            return;
        }

        const payload = {
            name: form.roleName.trim(),
            roleName: form.roleName.trim(),
            permissions: form.permissions,
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#1D6B5A]" />
                        {isEdit ? "Edit Role & Hak Akses" : "Tambah Role Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        Konfigurasikan peran pengguna dan atur batasan akses menu portal sesuai tanggung jawab.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* Nama Role */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">
                            Nama Role <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="cth: Supervisor Pool / HSE Auditor"
                            className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                            value={form.roleName}
                            onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                            required
                        />
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-800">
                            Hak Akses Fitur & Menu
                        </Label>

                        <div className="rounded-xl border border-[#DEDAD0] bg-[#F7F5EF]/60 p-3 space-y-3">
                            {GROUPS.map((group, idx) => {
                                const featureLabels = group.features.map((f) => f.label);
                                const isAllChecked = featureLabels.every((f) => form.permissions.includes(f));
                                const isSomeChecked = featureLabels.some((f) => form.permissions.includes(f));

                                return (
                                    <div key={idx} className="space-y-2">
                                        {group.name ? (
                                            <div className="flex items-center gap-2 border-b border-[#DEDAD0]/60 pb-1">
                                                <Checkbox
                                                    id={`group-${group.name}`}
                                                    checked={isAllChecked ? true : isSomeChecked ? "indeterminate" : false}
                                                    onCheckedChange={() => toggleGroup(featureLabels)}
                                                />
                                                <label
                                                    htmlFor={`group-${group.name}`}
                                                    className="text-xs font-semibold text-gray-800 cursor-pointer"
                                                >
                                                    {group.name}
                                                </label>
                                            </div>
                                        ) : null}

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-1">
                                            {group.features.map((feature) => (
                                                <div key={feature.label} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`perm-${feature.label}`}
                                                        checked={form.permissions.includes(feature.label)}
                                                        onCheckedChange={() => togglePermission(feature.label)}
                                                    />
                                                    <label
                                                        htmlFor={`perm-${feature.label}`}
                                                        className="text-xs text-gray-700 cursor-pointer"
                                                    >
                                                        {feature.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#DEDAD0]/60">
                        <Button type="button" variant="outline" onClick={handleClose} className="text-xs border-[#DEDAD0]">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white text-xs px-5 shadow-sm"
                        >
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Role"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
