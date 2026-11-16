"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLocations } from "@/features/location/hooks/use-location-queries";
import { useCreateDriver, useUpdateDriver } from "@/features/driver/hooks/driver-queries";
import type { DriverData, DriverFormValues, LicenseType } from "@/types/features/driver.type";
import { toast } from "sonner";

const LICENSE_TYPES: LicenseType[] = ["SIM A", "SIM B1", "SIM B2", "SIM C", "SIM D"];

const STATUSES = [
    { value: "Aktif",       color: "#22c55e" },
    { value: "Tidak Aktif", color: "#f97316" },
];

const generateEmployeeId = () =>
    `EMP-${new Date().getFullYear().toString().slice(2)}${Math.floor(100 + Math.random() * 900)}`;

interface DriverFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: DriverData;
}

const EMPTY_FORM: DriverFormValues = {
    name: "",
    licenseType: "SIM B2",
    licenseNumber: "",
    licenseExpiry: "",
    phone: "",
    locationId: "",
    status: "Aktif",
    notes: "",
};

export function DriverFormDialog({ open, setOpen, initialData }: DriverFormDialogProps) {
    const isEdit = !!initialData;
    const createMutation = useCreateDriver();
    const updateMutation = useUpdateDriver();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState<DriverFormValues>(EMPTY_FORM);
    const [locationOpen, setLocationOpen] = useState(false);
    const employeeId = useMemo(() => initialData?.employeeId || generateEmployeeId(), [open, initialData]);

    const { data: locData } = useLocations({ page: 1, itemPerPage: 100 });
    const availableLocations = useMemo(() => ((locData?.data as any)?.items || []) as Array<{ id: string; name: string }>, [locData]);

    const selectedLocation = availableLocations.find((l) => l.id === form.locationId);

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name: initialData.name || "",
                licenseType: (initialData.licenseType?.includes("B2") ? "SIM B2" : initialData.licenseType?.includes("B1") ? "SIM B1" : "SIM A") as LicenseType,
                licenseNumber: initialData.licenseNumber || "",
                licenseExpiry: initialData.licenseExpiry ? new Date(initialData.licenseExpiry).toISOString().split("T")[0] : "",
                phone: initialData.phone || "",
                locationId: (initialData as any).locationId || availableLocations[0]?.id || "",
                status: initialData.status === "Tidak Aktif" ? "Tidak Aktif" : "Aktif",
                notes: (initialData as any).notes || "",
            });
        } else if (open && !initialData) {
            setForm(EMPTY_FORM);
        }
    }, [open, initialData, availableLocations]);

    const handleClose = () => {
        setForm(EMPTY_FORM);
        setOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Nama pengemudi wajib diisi");
            return;
        }

        if (!form.licenseNumber.trim()) {
            toast.error("Nomor SIM wajib diisi");
            return;
        }

        if (!form.phone.trim()) {
            toast.error("Nomor telepon wajib diisi");
            return;
        }

        const payload = {
            name: form.name.trim(),
            licenseNumber: form.licenseNumber.trim(),
            phoneNumber: form.phone.trim(),
            status: form.status === "Tidak Aktif" ? "inactive" : "active",
            locationId: form.locationId || null,
            notes: form.notes || "",
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
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        {isEdit ? "Edit Data Driver" : "Tambah Driver Pengemudi"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        Lengkapi identitas driver pengemudi, nomor SIM, kontak, dan penempatan pool.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nama */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="cth: Bambang Sutrisno"
                                className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* ID Karyawan */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">ID Karyawan</Label>
                            <Input
                                value={employeeId}
                                disabled
                                className="h-10 text-xs border-[#DEDAD0] bg-neutral-100 text-[#7A7A72] cursor-not-allowed"
                            />
                        </div>

                        {/* Jenis SIM */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Jenis SIM <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(v) => setForm({ ...form, licenseType: v as LicenseType })}
                                value={form.licenseType}
                            >
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih jenis SIM" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LICENSE_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Nomor SIM */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Nomor SIM <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="cth: 9812-3456-789012"
                                className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={form.licenseNumber}
                                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                                required
                            />
                        </div>

                        {/* Nomor Telepon */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="cth: 081234567890"
                                className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Penempatan Pool / Lokasi */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Penempatan Pool</Label>
                            <Select
                                value={form.locationId}
                                onValueChange={(v) => setForm({ ...form, locationId: v })}
                            >
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih pool penempatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLocations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-medium text-gray-700">Status Driver</Label>
                            <Select
                                onValueChange={(v) => setForm({ ...form, status: v as any })}
                                value={form.status}
                            >
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
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
                        {/* Catatan */}
                        <div className="col-span-1 sm:col-span-2 space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Catatan Pengemudi (Opsional)</Label>
                            <textarea
                                placeholder="Catatan sertifikasi, riwayat rute, atau catatan medis..."
                                className="w-full min-h-[64px] rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] px-3 py-2 text-xs focus:border-[#1D6B5A] outline-none resize-none"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
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
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Driver"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
