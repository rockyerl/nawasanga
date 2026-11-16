"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAsset, useUpdateAsset } from "@/features/asset/hooks/use-asset-queries";
import { useFuelTypes } from "@/features/fuel-type/hooks/fuel-type-queries";
import { useDrivers } from "@/features/driver/hooks/driver-queries";
import { useLocations } from "@/features/location/hooks/use-location-queries";
import { Truck, Cpu, Zap, ShieldCheck, Fuel } from "lucide-react";
import { toast } from "sonner";
import { AssetTypes } from "@/types/features/asset.type";

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
    { label: "Tidak Aktif (Standby / Idle)", value: "Tidak Aktif", color: "#f97316" },
];

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: AssetTypes.Service.AssetData;
    defaultCategory?: "vehicle" | "equipment";
}

export function AssetFormDialog({ open, setOpen, initialData, defaultCategory = "vehicle" }: Props) {
    const isEdit = !!initialData;
    const [assetCategory, setAssetCategory] = useState<"vehicle" | "equipment">(defaultCategory);

    // Form fields
    const [plateOrSerial, setPlateOrSerial] = useState("");
    const [brandModel, setBrandModel] = useState("");
    const [assetType, setAssetType] = useState(VEHICLE_TYPES[0].value);
    const [fuelTypeId, setFuelTypeId] = useState("");
    const [driverId, setDriverId] = useState("none");
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
            const isEquip = initialData.category === "equipment";
            setAssetCategory(isEquip ? "equipment" : "vehicle");
            setPlateOrSerial(initialData.serialNumber || initialData.plateNumber || "");
            setBrandModel(initialData.brandModel || initialData.name || "");
            setAssetType(initialData.type || (isEquip ? EQUIPMENT_TYPES[0].value : VEHICLE_TYPES[0].value));
            setFuelTypeId(initialData.fuelTypeId || "");
            setDriverId(initialData.assignedDriverId || "none");
            setLocationId(initialData.locationId || "");
            setYearOrPower(String(initialData.year || 2024));
            setStatus(initialData.status || "Aktif");
            setNotes(initialData.notes || "");
        } else if (open && !initialData) {
            const initialCat = defaultCategory || "vehicle";
            setAssetCategory(initialCat);
            setPlateOrSerial("");
            setBrandModel("");
            setAssetType(initialCat === "vehicle" ? VEHICLE_TYPES[0].value : EQUIPMENT_TYPES[0].value);
            setFuelTypeId(fuelItems[0]?.id || "");
            setDriverId("none");
            setLocationId(locationItems[0]?.id || "");
            setYearOrPower(String(new Date().getFullYear()));
            setStatus("Aktif");
            setNotes("");
        }
    }, [open, initialData, defaultCategory, fuelItems, locationItems]);

    const handleCategoryChange = (cat: "vehicle" | "equipment") => {
        setAssetCategory(cat);
        setAssetType(cat === "vehicle" ? VEHICLE_TYPES[0].value : EQUIPMENT_TYPES[0].value);
        if (cat === "equipment") {
            setDriverId("none");
        }
    };

    const selectedFuel = fuelItems.find((f) => f.id === fuelTypeId);
    const isElectricity = selectedFuel?.category === "electricity" || selectedFuel?.name.toLowerCase().includes("listrik");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!plateOrSerial.trim()) {
            toast.error(assetCategory === "vehicle" ? "Nomor Plat kendaraan wajib diisi!" : "Nomor Seri / Asset Tag wajib diisi!");
            return;
        }

        if (!brandModel.trim()) {
            toast.error("Merk & model aset wajib diisi!");
            return;
        }

        if (!fuelTypeId) {
            toast.error("Pilih jenis bahan bakar / energi!");
            return;
        }

        if (!locationId) {
            toast.error("Pilih lokasi pool atau workshop!");
            return;
        }

        const payload = {
            category: assetCategory,
            name: `${brandModel.trim()} (${plateOrSerial.trim()})`,
            plateNumber: assetCategory === "vehicle" ? plateOrSerial.trim() : null,
            serialNumber: assetCategory === "equipment" ? plateOrSerial.trim() : plateOrSerial.trim(),
            brandModel: brandModel.trim(),
            type: assetType,
            fuelTypeId,
            assignedDriverId: assetCategory === "vehicle" && driverId !== "none" ? driverId : null,
            locationId,
            year: parseInt(yearOrPower, 10) || new Date().getFullYear(),
            status,
            notes: notes.trim(),
        };

        if (isEdit && initialData?.id) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => setOpen(false),
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => setOpen(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {assetCategory === "vehicle" ? (
                            <Truck className="w-5 h-5 text-[#1D6B5A]" />
                        ) : (
                            <Cpu className="w-5 h-5 text-[#1D6B5A]" />
                        )}
                        {isEdit ? "Edit Aset Operasional" : "Tambah Aset Operasional"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        {isEdit
                            ? "Perbarui spesifikasi armada atau mesin operasional dan alokasi driver/pool."
                            : "Daftarkan armada kendaraan operasional atau alat berat / genset ke sistem monitoring emisi."}
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
                        Armada Kendaraan (Fleet Mobil / Truk)
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
                        Alat Berat, Genset & Mesin Stasioner
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* Section 1: Identitas & Spesifikasi */}
                    <div className="rounded-xl border border-[#EDEAE0] bg-white p-4 space-y-3 shadow-xs">
                        <h4 className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5 pb-1 border-b border-[#F0EFEA]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Identitas & Spesifikasi Aset
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    {assetCategory === "vehicle" ? "Nomor Plat Kendaraan" : "Nomor Seri / Asset Tag ID"}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={plateOrSerial}
                                    onChange={(e) => setPlateOrSerial(e.target.value)}
                                    placeholder={assetCategory === "vehicle" ? "cth: B 9876 PQR" : "cth: GEN-CKR-250KVA"}
                                    className="h-10 text-xs uppercase bg-[#F7F5EF] border-[#DEDAD0]"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    {assetCategory === "vehicle" ? "Merk & Model Kendaraan" : "Merk & Tipe Mesin"}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={brandModel}
                                    onChange={(e) => setBrandModel(e.target.value)}
                                    placeholder={assetCategory === "vehicle" ? "cth: Hino Ranger 500 FL / Hilux" : "cth: Caterpillar 320D / Cummins 250kVA"}
                                    className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    {assetCategory === "vehicle" ? "Klasifikasi Armada" : "Jenis Alat / Mesin"}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select value={assetType} onValueChange={setAssetType}>
                                    <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
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

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    {assetCategory === "vehicle" ? "Tahun Pembuatan" : "Kapasitas / Daya (kW atau kVA)"}
                                </Label>
                                <Input
                                    value={yearOrPower}
                                    onChange={(e) => setYearOrPower(e.target.value)}
                                    placeholder={assetCategory === "vehicle" ? "2024" : "250"}
                                    className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Operasional & Energi */}
                    <div className="rounded-xl border border-[#EDEAE0] bg-white p-4 space-y-3 shadow-xs">
                        <h4 className="text-xs font-semibold text-[#1A1A18] flex items-center gap-1.5 pb-1 border-b border-[#F0EFEA]">
                            <Fuel className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            Bahan Bakar & Alokasi Operasional
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    Jenis Bahan Bakar / Energi <span className="text-red-500">*</span>
                                </Label>
                                <Select value={fuelTypeId} onValueChange={setFuelTypeId}>
                                    <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
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

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    Lokasi Pool / Workshop <span className="text-red-500">*</span>
                                </Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
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

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    {assetCategory === "vehicle" ? "Supir Penanggung Jawab" : "Operator / Pengawas"}
                                </Label>
                                {assetCategory === "vehicle" ? (
                                    <Select value={driverId} onValueChange={setDriverId}>
                                        <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                            <SelectValue placeholder="Pilih driver penanggung jawab..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Belum Ditugaskan (Standby)</SelectItem>
                                            {driverItems.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value="Stasioner (Tanpa Driver Bergerak)"
                                        disabled
                                        className="h-10 text-xs bg-neutral-100 text-[#7A7A72] border-[#DEDAD0] cursor-not-allowed"
                                    />
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">
                                    Status Operasional <span className="text-red-500">*</span>
                                </Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
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
                    </div>

                    {/* Alert Emisi Listrik Grid jika memilih Listrik */}
                    {isElectricity && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
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

                    {/* Catatan Operasional */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">Catatan Operasional (Opsional)</Label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Catatan jadwal servis rutin, riwayat perbaikan mesin, atau batas muatan tonase..."
                            className="w-full min-h-[64px] rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] px-3 py-2 text-xs focus:border-[#1D6B5A] outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEAE0]">
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
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white text-xs px-6 shadow-sm"
                        >
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Aset"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
