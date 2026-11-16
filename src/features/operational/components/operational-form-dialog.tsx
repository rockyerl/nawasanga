"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAsset, useUpdateAsset } from "@/features/operational/hooks/operational-user-queries";
import { useFuelTypes } from "@/features/fuel-type/hooks/fuel-type-queries";
import { useDrivers } from "@/features/driver/hooks/driver-queries";
import { useLocations } from "@/features/location/hooks/use-location-queries";
import { Truck, Cpu, Zap } from "lucide-react";
import { toast } from "sonner";
import { OperationalTypes } from "@/types/features/operational.type";

const VEHICLE_TYPES = [
    { value: "Heavy Truck", label: "Truk Berat (Tronton / Trailer / Gandengan)" },
    { value: "Medium Truck", label: "Truk Sedang (Fuso / Engkel 6 Roda)" },
    { value: "Light Truck", label: "Truk Ringan (Box / CDD / CDE 4 Roda)" },
    { value: "Mobil Operasional", label: "Mobil Penumpang / MPV / SUV Operasional" },
    { value: "Bus Angkutan", label: "Bus Angkutan Karyawan / Penumpang" },
    { value: "Sepeda Motor", label: "Sepeda Motor Operasional" },
];

const EQUIPMENT_TYPES = [
    { value: "Genset Industri", label: "Genset (Generator Set Listrik)" },
    { value: "Excavator", label: "Excavator (Alat Berat Galian / Tambang)" },
    { value: "Forklift", label: "Forklift (Gudang & Material Handling)" },
    { value: "Wheel Loader", label: "Wheel Loader / Bulldozer" },
    { value: "Mobile Crane", label: "Mobile / Tower Crane" },
    { value: "Pompa Industri", label: "Pompa Industri / Kompresor Tekanan Tinggi" },
];

const STATUSES = [
    { label: "Aktif (Operational)", value: "Aktif", color: "#22c55e" },
    { label: "Perawatan (Maintenance)", value: "Maintenance", color: "#3b82f6" },
    { label: "Tidak Aktif (Idle / Standby)", value: "Tidak Aktif", color: "#f97316" },
];

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: OperationalTypes.Service.AssetData;
}

export function AssetFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const [assetCategory, setAssetCategory] = useState<"vehicle" | "equipment">("vehicle");

    // Form fields
    const [plateOrSerial, setPlateOrSerial] = useState("");
    const [brandModel, setBrandModel] = useState("");
    const [assetType, setAssetType] = useState(VEHICLE_TYPES[0].value);
    const [fuelTypeId, setFuelTypeId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [yearOrPower, setYearOrPower] = useState(String(new Date().getFullYear()));
    const [status, setStatus] = useState("Aktif");
    const [notes, setNotes] = useState("");

    // Queries
    const { data: fuelData } = useFuelTypes({ page: 1, itemPerPage: 50 });
    const { data: driverData } = useDrivers({ page: 1, itemPerPage: 50 });
    const { data: locData } = useLocations({ page: 1, itemPerPage: 50 });

    const fuelItems = (((fuelData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
        category: string;
        emissionFactor: number;
        unit: string;
    }>);

    const driverItems = (((driverData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
    }>);

    const locationItems = (((locData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
    }>);

    const createMutation = useCreateAsset();
    const updateMutation = useUpdateAsset();
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (open && initialData) {
            const isEquip = (initialData as any).category === "equipment";
            setAssetCategory(isEquip ? "equipment" : "vehicle");
            setPlateOrSerial(initialData.serialNumber || (initialData as any).plateNumber || "");
            setBrandModel((initialData as any).brandModel || initialData.name || "");
            setAssetType(initialData.type || (isEquip ? EQUIPMENT_TYPES[0].value : VEHICLE_TYPES[0].value));
            setFuelTypeId((initialData as any).fuelTypeId || "");
            setDriverId((initialData as any).assignedDriverId || "none");
            setLocationId((initialData as any).locationId || "");
            setYearOrPower(String((initialData as any).year || 2023));
            setStatus(initialData.status || "Aktif");
            setNotes(initialData.notes || "");
        } else if (open && !initialData) {
            resetForm();
        }
    }, [open, initialData]);

    const selectedFuel = fuelItems.find((f) => f.id === fuelTypeId);
    const isElectricity = selectedFuel?.category === "electricity" || selectedFuel?.name.toLowerCase().includes("listrik");

    const resetForm = () => {
        setPlateOrSerial("");
        setBrandModel("");
        setAssetType(assetCategory === "vehicle" ? VEHICLE_TYPES[0].value : EQUIPMENT_TYPES[0].value);
        setFuelTypeId("");
        setDriverId("");
        setLocationId("");
        setYearOrPower(String(new Date().getFullYear()));
        setStatus("Aktif");
        setNotes("");
    };

    const handleCategoryChange = (cat: "vehicle" | "equipment") => {
        setAssetCategory(cat);
        setAssetType(cat === "vehicle" ? VEHICLE_TYPES[0].value : EQUIPMENT_TYPES[0].value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!plateOrSerial.trim()) {
            toast.error(assetCategory === "vehicle" ? "Nomor Plat Kendaraan wajib diisi" : "Nomor Seri / Tag ID Aset wajib diisi");
            return;
        }

        if (!brandModel.trim()) {
            toast.error(assetCategory === "vehicle" ? "Merk & Model Kendaraan wajib diisi" : "Merk / Tipe Mesin wajib diisi");
            return;
        }

        if (!fuelTypeId) {
            toast.error("Pilih jenis bahan bakar / energi");
            return;
        }

        const payload = {
            name: brandModel.trim(),
            brandModel: brandModel.trim(),
            plateNumber: plateOrSerial.trim().toUpperCase(),
            serialNumber: plateOrSerial.trim().toUpperCase(),
            type: assetType,
            vehicleType: assetType,
            fuelType: selectedFuel?.name || "Bio Solar",
            fuelTypeId: fuelTypeId,
            assignedDriverId: assetCategory === "vehicle" ? (driverId && driverId !== "none" ? driverId : null) : null,
            locationId: locationId || (locationItems[0]?.id ?? null),
            location: locationItems.find((l) => l.id === locationId)?.name || "Pool Utama",
            year: parseInt(yearOrPower, 10) || new Date().getFullYear(),
            power: assetCategory === "equipment" ? `${yearOrPower || "150"} kW/kVA` : `${yearOrPower || 2023} - Euro 4`,
            fuelConsumption: isElectricity ? (assetCategory === "vehicle" ? "4.8 km/kWh" : "45 kWh/Jam") : (assetCategory === "vehicle" ? "3.2 km/L" : "18.5 L/Jam"),
            status: status as any,
            notes: notes.trim(),
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        resetForm();
                        setOpen(false);
                    },
                }
            );
        } else {
            createMutation.mutate(payload as any, {
                onSuccess: () => {
                    resetForm();
                    setOpen(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        {isEdit ? "Edit Aset Operasional" : "Tambah Aset Operasional"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        {isEdit ? "Perbarui informasi armada atau alat berat operasional." : "Daftarkan armada kendaraan atau aset alat berat & mesin stasioner ke sistem monitoring emisi."}
                    </DialogDescription>
                </DialogHeader>

                {/* Category Switcher Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F5EF] rounded-xl border border-[#DEDAD0]/60 my-2">
                    <button
                        type="button"
                        onClick={() => handleCategoryChange("vehicle")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            assetCategory === "vehicle"
                                ? "bg-[#1D6B5A] text-white shadow-sm"
                                : "text-[#7A7A72] hover:text-[#1A1A18]"
                        }`}
                    >
                        <Truck size={15} />
                        Armada Kendaraan (Fleet)
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCategoryChange("equipment")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            assetCategory === "equipment"
                                ? "bg-[#1D6B5A] text-white shadow-sm"
                                : "text-[#7A7A72] hover:text-[#1A1A18]"
                        }`}
                    >
                        <Cpu size={15} />
                        Alat Berat & Genset (Stasioner)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                        {/* Identitas (Plat Nomor vs Serial Number) */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                {assetCategory === "vehicle" ? "Nomor Plat Kendaraan" : "Nomor Seri / Asset Tag ID"}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={plateOrSerial}
                                onChange={(e) => setPlateOrSerial(e.target.value)}
                                placeholder={assetCategory === "vehicle" ? "cth: B 9876 PQR" : "cth: GEN-CKR-250KVA / EXC-01"}
                                className="h-9 text-sm uppercase bg-[#F7F5EF] border-[#DEDAD0]"
                                required
                            />
                        </div>

                        {/* Nama / Merk & Model */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                {assetCategory === "vehicle" ? "Merk & Model Kendaraan" : "Merk & Tipe Mesin / Alat"}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={brandModel}
                                onChange={(e) => setBrandModel(e.target.value)}
                                placeholder={assetCategory === "vehicle" ? "cth: Hino Ranger 500 FL / Toyota Hilux" : "cth: Caterpillar 320D / Cummins 250kVA"}
                                className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]"
                                required
                            />
                        </div>

                        {/* Tipe / Klasifikasi */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                {assetCategory === "vehicle" ? "Klasifikasi Armada" : "Jenis Alat / Mesin"}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select value={assetType} onValueChange={setAssetType}>
                                <SelectTrigger className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih klasifikasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(assetCategory === "vehicle" ? VEHICLE_TYPES : EQUIPMENT_TYPES).map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bahan Bakar / Energi (Termasuk Listrik & Biofuel) */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Jenis Energi / Bahan Bakar <span className="text-red-500">*</span>
                            </Label>
                            <Select value={fuelTypeId} onValueChange={setFuelTypeId}>
                                <SelectTrigger className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih jenis bahan bakar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {fuelItems.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            <span className="flex items-center gap-1.5">
                                                {f.category === "electricity" ? (
                                                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                                                ) : null}
                                                {f.name} ({f.emissionFactor} kg CO₂/{f.unit || "L"})
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tahun Pembuatan atau Daya (KW/kVA) */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                {assetCategory === "vehicle" ? "Tahun Pembuatan" : "Kapasitas / Daya (kW atau kVA)"}
                            </Label>
                            <Input
                                value={yearOrPower}
                                onChange={(e) => setYearOrPower(e.target.value)}
                                placeholder={assetCategory === "vehicle" ? "2023" : "250"}
                                className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]"
                            />
                        </div>

                        {/* Lokasi Pool / Site */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Lokasi Pool / Workshop <span className="text-red-500">*</span>
                            </Label>
                            <Select value={locationId} onValueChange={setLocationId}>
                                <SelectTrigger className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih lokasi pool..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {locationItems.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Driver / Pengemudi (Hanya untuk Kendaraan Bergerak) */}
                        {assetCategory === "vehicle" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    Supir / Driver Penanggung Jawab
                                </Label>
                                <Select value={driverId} onValueChange={setDriverId}>
                                    <SelectTrigger className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]">
                                        <SelectValue placeholder="Pilih driver penanggung jawab..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Belum Ditugaskan</SelectItem>
                                        {driverItems.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Status Operasional */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Status Aset</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-9 text-sm bg-[#F7F5EF] border-[#DEDAD0]">
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

                    {/* Alert Emisi Listrik Grid jika memilih Listrik */}
                    {isElectricity && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3 flex items-start gap-2.5 text-xs text-amber-900">
                            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-800">
                                    Aset Berbasis Energi Listrik (EV / Electric Grid)
                                </p>
                                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                                    Meskipun kendaraan listrik tidak menghasilkan emisi langsung knalpot (*zero tailpipe emission*), konsumsi daya listrik tetap diperhitungkan sebagai <strong>Emisi Tidak Langsung (Scope 2)</strong> berdasarkan faktor emisi grid ketenagalistrikan ESDM (0.79 kg CO₂/kWh).
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Catatan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">Catatan Operasional (Opsional)</Label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Tambahkan riwayat servis, jadwal perawatan, atau catatan site di sini..."
                            className="w-full min-h-[60px] rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] px-3 py-2 text-xs focus:border-[#1D6B5A] outline-none resize-none"
                        />
                    </div>

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
                            disabled={isPending}
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white text-xs px-5"
                        >
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Aset"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
