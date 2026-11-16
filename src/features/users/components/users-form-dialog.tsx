"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateUserPage, useUpdateUserPage } from "@/features/users/hooks/use-users-queries";
import type { UserData, UserFormValues } from "@/types/features/user.type";
import { toast } from "sonner";

const ROLES = [
    "Super Admin",
    "Admin",
    "Operator",
    "Viewer",
    "Auditor",
    "Finance",
    "HR Manager",
    "IT Support",
    "Data Entry",
    "Coordinator",
    "Client Admin",
    "Client Operator",
    "Client Viewer",
];

const STATUSES = [
    { value: "Aktif", color: "#22c55e" },
    { value: "Tidak Aktif", color: "#f97316" },
];

interface UserFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: UserData | null;
}

export function UserFormDialog({ open, setOpen, initialData }: UserFormDialogProps) {
    const isEdit = !!initialData;
    const createMutation = useCreateUserPage();
    const updateMutation = useUpdateUserPage();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState<UserFormValues>({
        name: "",
        email: "",
        phone: "",
        role: "Operator",
        status: "Aktif",
    });

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                role: initialData.role || "Operator",
                status: (initialData.status as UserFormValues["status"]) || "Aktif",
            });
        } else if (open && !initialData) {
            setForm({
                name: "",
                email: "",
                phone: "",
                role: "Operator",
                status: "Aktif",
            });
        }
    }, [open, initialData]);

    const handleClose = () => {
        setForm({ name: "", email: "", phone: "", role: "Operator", status: "Aktif" });
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            toast.error("Nama dan email wajib diisi!");
            return;
        }

        if (isEdit && initialData?.id) {
            updateMutation.mutate(
                { id: initialData.id, payload: form },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                }
            );
        } else {
            createMutation.mutate(form, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl bg-[#FDFCFA]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        {isEdit
                            ? "Perbarui informasi akun, role, dan hak akses pengguna."
                            : "Daftarkan akun pengguna baru untuk mengelola platform."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Masukkan nama lengkap"
                                className="border-neutral-200"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
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
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                                No. Telepon / WhatsApp
                            </Label>
                            <Input
                                placeholder="08123456789"
                                className="border-neutral-200"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                                Role Akses <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={(v) => setForm({ ...form, role: v })} value={form.role}>
                                <SelectTrigger className="border-neutral-200 bg-white">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r} value={r}>
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Status Akun <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(v) => setForm({ ...form, status: v as UserFormValues["status"] })}
                                value={form.status}
                            >
                                <SelectTrigger className="border-neutral-200 bg-white">
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

                    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white font-medium"
                        >
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
