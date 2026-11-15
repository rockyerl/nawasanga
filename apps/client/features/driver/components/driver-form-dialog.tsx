"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockLocations } from "@/lib/mock-data/driver.mock";
import type { DriverFormValues, LicenseType } from "@/types/features/driver.type";

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
}

const EMPTY_FORM: DriverFormValues = {
    name: "",
    licenseType: "",
    licenseNumber: "",
    licenseExpiry: "",
    phone: "",
    locationId: "",
    status: "",
    notes: "",
};

export function DriverFormDialog({ open, setOpen }: DriverFormDialogProps) {
    const [form, setForm] = useState<DriverFormValues>(EMPTY_FORM);
    const [locationOpen, setLocationOpen] = useState(false);
    const employeeId = useMemo(() => generateEmployeeId(), [open]);

    const selectedLocation = mockLocations.find((l) => l.id === form.locationId);

    const handleClose = () => {
        setForm(EMPTY_FORM);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Tambah Driver</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Nama */}
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

                    {/* ID Karyawan */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">ID Karyawan</Label>
                        <Input
                            value={employeeId}
                            disabled
                            className="border-neutral-200 bg-neutral-50 text-[#8E8E8E] cursor-not-allowed"
                        />
                    </div>

                    {/* Jenis SIM */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Jenis SIM <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(v) => setForm({ ...form, licenseType: v as LicenseType })}
                            value={form.licenseType}
                        >
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder="Pilih jenis SIM" />
                            </SelectTrigger>
                            <SelectContent>
                                {LICENSE_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nomor SIM */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Nomor SIM <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan nomor SIM"
                            className="border-neutral-200"
                            value={form.licenseNumber}
                            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                        />
                    </div>

                    {/* Tanggal Kadaluarsa SIM */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Tanggal Kadaluarsa SIM <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="date"
                            className="border-neutral-200"
                            value={form.licenseExpiry}
                            onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })}
                        />
                    </div>

                    {/* No. Telepon */}
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

                    {/* Lokasi */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Lokasi <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between border-neutral-200 font-normal",
                                        !form.locationId && "text-muted-foreground"
                                    )}
                                >
                                    {selectedLocation ? selectedLocation.name : "Cari lokasi..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Cari lokasi..." />
                                    <CommandList>
                                        <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {mockLocations.map((loc) => (
                                                <CommandItem
                                                    key={loc.id}
                                                    value={loc.name}
                                                    onSelect={() => {
                                                        setForm({ ...form, locationId: loc.id });
                                                        setLocationOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            form.locationId === loc.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {loc.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(v) => setForm({ ...form, status: v as DriverFormValues["status"] })}
                            value={form.status}
                        >
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

                    {/* Catatan - full width */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Catatan</Label>
                        <textarea
                            placeholder="Masukkan catatan tambahan (opsional)"
                            className="flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                            rows={3}
                            value={form.notes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, notes: e.target.value })}
                        />
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