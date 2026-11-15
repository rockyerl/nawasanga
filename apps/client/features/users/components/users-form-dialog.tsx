"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserFormValues } from "@/types/features/user.type";

const ROLES = ["Super Admin", "Admin", "Operator", "Viewer", "Auditor", "Finance", "HR Manager", "IT Support", "Data Entry", "Coordinator"];
const STATUSES = [
    { value: "Aktif", color: "#22c55e" },
    { value: "Tidak Aktif", color: "#f97316" },
];

interface UserFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function UserFormDialog({ open, setOpen }: UserFormDialogProps) {
    const [form, setForm] = useState<UserFormValues>({
        name: "", email: "", phone: "", role: "", status: "",
    });

    const handleClose = () => {
        setForm({ name: "", email: "", phone: "", role: "", status: "" });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Tambah User</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan nama lengkap"
                            className="border-neutral-200"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan alamat email"
                            type="email"
                            className="border-neutral-200"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            No. Telepon <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan nomor telepon"
                            className="border-neutral-200"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Role <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(v) => setForm({ ...form, role: v })} value={form.role}>
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(v) => setForm({ ...form, status: v as UserFormValues["status"] })} value={form.status}>
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                                            {s.value}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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