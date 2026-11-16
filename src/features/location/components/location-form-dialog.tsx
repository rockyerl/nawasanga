"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLocation, useUpdateLocation } from "@/features/location/hooks/use-location-queries";
import type { Location, LocationType, LocationStatus } from "@/types/features/location.type";
import { MapPin, UserCheck, Phone, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Dynamic import for Leaflet interactive map
const LocationMap = dynamic(
    () => import("@/features/organization/components/organization-location-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-64 w-full rounded-xl border border-[#DEDAD0] bg-[#F7F5EF] flex items-center justify-center text-xs text-[#7A7A72] gap-2">
                <MapPin className="w-4 h-4 text-[#1D6B5A] animate-pulse" />
                Memuat peta interaktif...
            </div>
        ),
    }
);

const TYPES: { value: LocationType; label: string }[] = [
    { value: "Pool", label: "Pool Kendaraan / Armada" },
    { value: "Site", label: "Site Proyek / Operasional" },
    { value: "Warehouse", label: "Gudang / Warehouse / Depo" },
    { value: "Branch", label: "Kantor Cabang / Kantor Operasional" },
];

const STATUSES: { value: LocationStatus; label: string; color: string }[] = [
    { value: "Aktif", label: "Aktif (Beroperasi)", color: "#22c55e" },
    { value: "Tidak Aktif", label: "Tidak Aktif / Nonaktif", color: "#f97316" },
];

interface LocationFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: Location;
}

export function LocationFormDialog({ open, setOpen, initialData }: LocationFormDialogProps) {
    const isEdit = !!initialData;
    const createMutation = useCreateLocation();
    const updateMutation = useUpdateLocation();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [name, setName] = useState("");
    const [type, setType] = useState<LocationType>("Pool");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [latitude, setLatitude] = useState<number | null>(-6.1754);
    const [longitude, setLongitude] = useState<number | null>(106.8272);
    const [pic, setPic] = useState("");
    const [picPhone, setPicPhone] = useState("");
    const [status, setStatus] = useState<LocationStatus>("Aktif");

    useEffect(() => {
        if (open && initialData) {
            setName(initialData.name || "");
            setType(initialData.type || "Pool");
            setAddress(initialData.address || "");
            setCity(initialData.city || "");
            setProvince(initialData.province || "");
            setLatitude(typeof initialData.latitude === "number" ? initialData.latitude : -6.1754);
            setLongitude(typeof initialData.longitude === "number" ? initialData.longitude : 106.8272);
            setPic(initialData.pic || "");
            setPicPhone(initialData.picPhone || "");
            setStatus(initialData.status || "Aktif");
        } else if (open && !initialData) {
            setName("");
            setType("Pool");
            setAddress("");
            setCity("");
            setProvince("");
            setLatitude(-6.1754);
            setLongitude(106.8272);
            setPic("");
            setPicPhone("");
            setStatus("Aktif");
        }
    }, [open, initialData]);

    const handleLocationSelect = (data: {
        lat: number;
        lng: number;
        address: string;
        city: string;
        province: string;
    }) => {
        setLatitude(data.lat);
        setLongitude(data.lng);
        if (data.address && !address) setAddress(data.address);
        if (data.city) setCity(data.city);
        if (data.province) setProvince(data.province);
        toast.success("Titik lokasi dan alamat berhasil dipin");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Nama lokasi / pool wajib diisi.");
            return;
        }

        if (!address.trim()) {
            toast.error("Alamat lokasi wajib diisi atau dipin pada peta.");
            return;
        }

        if (!pic.trim()) {
            toast.error("Nama PIC / Penanggung Jawab wajib diisi.");
            return;
        }

        const payload = {
            name: name.trim(),
            type,
            address: address.trim(),
            city: city.trim(),
            province: province.trim(),
            latitude,
            longitude,
            pic: pic.trim(),
            picPhone: picPhone.trim(),
            status,
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        setOpen(false);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    setOpen(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#1D6B5A]" />
                        {isEdit ? "Edit Lokasi & Pool" : "Tambah Lokasi / Pool Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        Tentukan titik koordinat pool atau site operasional pada peta, lengkapi alamat dan kontak PIC penanggung jawab.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* General info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Nama Lokasi / Pool <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="cth: Pool Utama Cikarang / Site Palembang"
                                className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Tipe Lokasi <span className="text-red-500">*</span>
                            </Label>
                            <Select value={type} onValueChange={(v) => setType(v as LocationType)}>
                                <SelectTrigger className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih tipe lokasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Interactive Leaflet Map */}
                    <div className="space-y-1.5 border-t border-b border-[#DEDAD0]/60 py-3">
                        <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[#1D6B5A]" />
                                Titik Peta Lokasi & Geocoding
                            </Label>
                            <span className="text-[11px] text-[#7A7A72]">
                                Klik atau geser pin untuk auto-fill alamat dan koordinat
                            </span>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-[#DEDAD0] shadow-sm">
                            <LocationMap
                                latitude={latitude}
                                longitude={longitude}
                                address={address}
                                city={city}
                                province={province}
                                onLocationSelect={handleLocationSelect}
                            />
                        </div>
                    </div>

                    {/* Address & Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3 space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Alamat Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                placeholder="Alamat jalan, nomor, RT/RW, kawasan industri..."
                                className="w-full min-h-[60px] rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] px-3 py-2 text-xs focus:border-[#1D6B5A] outline-none resize-none"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Kota / Kabupaten</Label>
                            <Input
                                placeholder="cth: Bekasi"
                                className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Provinsi</Label>
                            <Input
                                placeholder="cth: Jawa Barat"
                                className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Status Operasional</Label>
                            <Select value={status} onValueChange={(v) => setStatus(v as LocationStatus)}>
                                <SelectTrigger className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                                                {s.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* PIC Section - Direct Input */}
                    <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DEDAD0] space-y-3">
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-[#1D6B5A]" />
                            <Label className="text-xs font-semibold text-gray-800">
                                Penanggung Jawab Lapangan (PIC Pool / Site)
                            </Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    Nama PIC / Koordinator <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="cth: Hendra Setiawan"
                                    className="h-9 text-xs bg-white border-[#DEDAD0]"
                                    value={pic}
                                    onChange={(e) => setPic(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    No. Telepon / WhatsApp PIC
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A7A72]" />
                                    <Input
                                        placeholder="cth: +62 812-3456-7890"
                                        className="h-9 pl-8 text-xs bg-white border-[#DEDAD0]"
                                        value={picPhone}
                                        onChange={(e) => setPicPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#DEDAD0]/60">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="text-xs border-[#DEDAD0]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white text-xs px-5 shadow-sm"
                        >
                            {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Lokasi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
