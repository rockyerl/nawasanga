"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RoleFormValues } from "@/types/features/role.type";

const SIDEBAR_FEATURES = [
    { label: "Dashboard",       group: null },
    { label: "User",            group: "Pengguna" },
    { label: "Role",            group: "Pengguna" },
    { label: "Driver",          group: "Pengguna" },
    { label: "Lokasi",          group: "Manajemen Aset" },
    { label: "Aset",            group: "Manajemen Aset" },
    { label: "Log",             group: null },
    { label: "Laporan",         group: null },
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
}

export function RoleFormDialog({ open, setOpen }: RoleFormDialogProps) {
    const [form, setForm] = useState<RoleFormValues>({ roleName: "", permissions: [] });

    const handleClose = () => {
        setForm({ roleName: "", permissions: [] });
        setOpen(false);
    };

    const togglePermission = (feature: string) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(feature)
                ? prev.permissions.filter((p) => p !== feature)
                : [...prev.permissions, feature],
        }));
    };

    const toggleGroup = (features: string[]) => {
        const allChecked = features.every((f) => form.permissions.includes(f));
        setForm((prev) => ({
            ...prev,
            permissions: allChecked
                ? prev.permissions.filter((p) => !features.includes(p))
                : [...new Set([...prev.permissions, ...features])],
        }));
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Tambah Role</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Nama Role <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan nama role"
                            className="border-neutral-200"
                            value={form.roleName}
                            onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Permission <span className="text-red-500">*</span>
                        </Label>
                        <div className="rounded-md border border-neutral-200 divide-y divide-neutral-100">
                            {GROUPS.map((group) => {
                                const groupFeatures = group.features.map((f) => f.label);
                                const allChecked = groupFeatures.every((f) => form.permissions.includes(f));
                                const someChecked = groupFeatures.some((f) => form.permissions.includes(f));

                                return (
                                    <div key={group.name ?? "standalone"} className="p-3">
                                        {group.name && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Checkbox
                                                    id={`group-${group.name}`}
                                                    checked={allChecked}
                                                    data-state={someChecked && !allChecked ? "indeterminate" : undefined}
                                                    onCheckedChange={() => toggleGroup(groupFeatures)}
                                                />
                                                <label
                                                    htmlFor={`group-${group.name}`}
                                                    className="text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer"
                                                >
                                                    {group.name}
                                                </label>
                                            </div>
                                        )}
                                        <div className={`grid grid-cols-3 gap-2 ${group.name ? "pl-5" : ""}`}>
                                            {group.features.map((feature) => (
                                                <div key={feature.label} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`perm-${feature.label}`}
                                                        checked={form.permissions.includes(feature.label)}
                                                        onCheckedChange={() => togglePermission(feature.label)}
                                                    />
                                                    <label
                                                        htmlFor={`perm-${feature.label}`}
                                                        className="text-sm text-gray-700 cursor-pointer"
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
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={handleClose}>Batal</Button>
                    <Button className="bg-[#29A2A5] hover:bg-[#29A2A5]/90 text-white" onClick={handleClose}>
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}