"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const PROVINCES = [
    "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "DI Yogyakarta",
    "Bali", "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan",
    "Banten", "Riau",
];

const CITIES: Record<string, string[]> = {
    "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur"],
    "Jawa Barat": ["Bandung", "Cirebon", "Cimahi", "Bogor", "Sukabumi", "Karawang", "Depok", "Bekasi"],
    "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Salatiga"],
    "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Mojokerto"],
    "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul"],
    "Bali": ["Denpasar", "Badung", "Gianyar"],
    "Sumatera Utara": ["Medan", "Deli Serdang"],
    "Sumatera Selatan": ["Palembang", "Prabumulih"],
    "Kalimantan Timur": ["Balikpapan", "Samarinda"],
    "Sulawesi Selatan": ["Makassar", "Gowa"],
    "Banten": ["Tangerang Selatan", "Tangerang", "Serang"],
    "Riau": ["Pekanbaru", "Dumai"],
};

const TYPES = ["Pool", "Site", "Warehouse", "Branch"] as const;

const STATUSES = [
    { value: "Aktif", color: "#22c55e" },
    { value: "Tidak Aktif", color: "#f97316" },
];

const ALL_PICS = [
    "Ahmad Fauzi", "Budi Santoso", "Dewi Lestari", "Rizki Pratama", "Eko Wahyudi",
    "Siti Rahayu", "Hendra Kusuma", "Rina Wulandari", "Joko Purnomo", "Ayu Maharani",
    "Dimas Setiawan", "Mega Putri", "Bagas Nugroho", "Intan Permata", "Wahyu Hidayat",
];

interface LocationFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function LocationFormDialog({ open, setOpen }: LocationFormDialogProps) {
    const [form, setForm] = useState({
        name: "",
        type: "",
        province: "",
        city: "",
        address: "",
        pic: "",
        status: "",
    });
    const [picSearch, setPicSearch] = useState("");
    const [picOpen, setPicOpen] = useState(false);

    const filteredPics = ALL_PICS.filter((p) =>
        p.toLowerCase().includes(picSearch.toLowerCase())
    );

    const availableCities = form.province ? CITIES[form.province] ?? [] : [];

    const handleProvinceChange = (v: string) => {
        setForm({ ...form, province: v, city: "" });
    };

    const handleReset = () => {
        setForm({ name: "", type: "", province: "", city: "", address: "", pic: "", status: "" });
        setPicSearch("");
    };

    const handleClose = () => {
        handleReset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Tambah Lokasi</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Nama */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Masukkan nama lokasi"
                            className="border-neutral-200"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    {/* Tipe */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Tipe <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(v) => setForm({ ...form, type: v })} value={form.type}>
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Provinsi */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Provinsi <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={handleProvinceChange} value={form.province}>
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder="Pilih provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROVINCES.map((p) => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kota */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Kota <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(v) => setForm({ ...form, city: v })}
                            value={form.city}
                            disabled={!form.province}
                        >
                            <SelectTrigger className="border-neutral-200">
                                <SelectValue placeholder={form.province ? "Pilih kota" : "Pilih provinsi terlebih dahulu"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCities.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* PIC — searchable dropdown */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            PIC <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#29A2A5]"
                                onClick={() => setPicOpen((prev) => !prev)}
                            >
                                <span className={form.pic ? "text-gray-700" : "text-[#8E8E8E]"}>
                                    {form.pic || "Cari PIC..."}
                                </span>
                                <Search className="h-4 w-4 text-[#8E8E8E]" />
                            </button>
                            {picOpen && (
                                <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg">
                                    <div className="p-2 border-b border-neutral-100">
                                        <Input
                                            autoFocus
                                            placeholder="Cari berdasarkan nama..."
                                            className="h-8 border-neutral-200 text-sm"
                                            value={picSearch}
                                            onChange={(e) => setPicSearch(e.target.value)}
                                        />
                                    </div>
                                    <ul className="max-h-48 overflow-y-auto py-1">
                                        {filteredPics.length > 0 ? (
                                            filteredPics.map((p) => (
                                                <li
                                                    key={p}
                                                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-neutral-50"
                                                    onClick={() => {
                                                        setForm({ ...form, pic: p });
                                                        setPicSearch("");
                                                        setPicOpen(false);
                                                    }}
                                                >
                                                    {p}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-3 py-2 text-sm text-[#8E8E8E]">Data tidak ditemukan.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(v) => setForm({ ...form, status: v })} value={form.status}>
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

                    {/* Alamat */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Alamat <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            placeholder="Masukkan alamat lengkap..."
                            className="w-full min-h-[100px] rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-700 placeholder:text-[#8E8E8E] outline-none resize-none focus:border-[#29A2A5]"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            maxLength={1000}
                        />
                        <p className="text-xs text-[#8E8E8E]">Maks. 1000 karakter. ({form.address.length}/1000)</p>
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