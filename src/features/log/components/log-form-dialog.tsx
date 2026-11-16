"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLog, useUpdateLog } from "@/features/log/hooks/use-log-queries";
import { useAssets } from "@/features/asset/hooks/use-asset-queries";
import { useDrivers } from "@/features/driver/hooks/driver-queries";
import { useFuelTypes } from "@/features/fuel-type/hooks/fuel-type-queries";
import { Fuel, Zap, Calculator, Gauge, User, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: any;
}

export function LogFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateLog();
    const updateMutation = useUpdateLog();
    const isPending = createMutation.isPending || updateMutation.isPending;

    // Queries
    const { data: assetData } = useAssets({ page: 1, itemPerPage: 100 });
    const { data: driverData } = useDrivers({ page: 1, itemPerPage: 100 });
    const { data: fuelData } = useFuelTypes({ page: 1, itemPerPage: 50 });

    const vehicles = (((assetData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
        brandModel: string;
        plateNumber: string;
        fuelTypeId?: string;
    }>);

    const drivers = (((driverData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
    }>);

    const fuelTypes = (((fuelData?.data as any)?.items || []) as Array<{
        id: string;
        name: string;
        category: string;
        emissionFactor: number;
        pricePerUnit: number;
        unit: string;
    }>);

    // Form fields
    const [vehicleId, setVehicleId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [fuelTypeId, setFuelTypeId] = useState("");
    const [liters, setLiters] = useState("");
    const [odometerKm, setOdometerKm] = useState("");
    const [loggedAt, setLoggedAt] = useState(new Date().toISOString().slice(0, 16));
    const [notes, setNotes] = useState("");

    const selectedFuel = fuelTypes.find((f) => f.id === fuelTypeId);
    const isElectricity = selectedFuel?.category === "electricity" || selectedFuel?.name.toLowerCase().includes("listrik");

    // Auto-calculate live metrics
    const numLiters = parseFloat(liters) || 0;
    const estEmission = parseFloat((numLiters * (selectedFuel?.emissionFactor || 2.68)).toFixed(2));
    const estCost = Math.round(numLiters * (selectedFuel?.pricePerUnit || 6800));

    useEffect(() => {
        if (open && initialData) {
            setVehicleId(initialData.vehicleId || initialData.vehicle?.id || "");
            setDriverId(initialData.driverId || initialData.driver?.id || "");
            setFuelTypeId(initialData.fuelTypeId || initialData.fuelType?.id || "");
            setLiters(String(initialData.liters || ""));
            setOdometerKm(String(initialData.odometerKm || ""));
            setLoggedAt(initialData.loggedAt ? new Date(initialData.loggedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
            setNotes(initialData.notes || "");
        } else if (open && !initialData) {
            setVehicleId(vehicles[0]?.id || "");
            setDriverId(drivers[0]?.id || "");
            setFuelTypeId(fuelTypes[0]?.id || "");
            setLiters("");
            setOdometerKm("");
            setLoggedAt(new Date().toISOString().slice(0, 16));
            setNotes("");
        }
    }, [open, initialData, vehicles, drivers, fuelTypes]);

    // When vehicle changes, auto-select its default fuel type if available
    const handleVehicleChange = (vId: string) => {
        setVehicleId(vId);
        const v = vehicles.find((item) => item.id === vId);
        if (v?.fuelTypeId && fuelTypes.some((f) => f.id === v.fuelTypeId)) {
            setFuelTypeId(v.fuelTypeId);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vehicleId) {
            toast.error("Pilih kendaraan atau armada");
            return;
        }

        if (!fuelTypeId) {
            toast.error("Pilih jenis bahan bakar / energi");
            return;
        }

        if (!liters || parseFloat(liters) <= 0) {
            toast.error("Jumlah konsumsi bahan bakar harus lebih besar dari 0");
            return;
        }

        const payload = {
            vehicleId,
            driverId: driverId && driverId !== "none" ? driverId : null,
            fuelTypeId,
            liters: parseFloat(liters),
            costIdr: estCost,
            odometerKm: odometerKm ? parseInt(odometerKm, 10) : null,
            loggedAt: new Date(loggedAt).toISOString(),
            notes: notes.trim(),
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
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
                    <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-[#1D6B5A]" />
                        {isEdit ? "Edit Catatan Pengisian BBM" : "Catat Konsumsi BBM & Energi"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#7A7A72]">
                        Catat transaksi pengisian bahan bakar atau daya listrik untuk kalkulasi emisi Scope 1 & 2 secara akurat.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pilih Armada */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Kendaraan / Armada <span className="text-red-500">*</span>
                            </Label>
                            <Select value={vehicleId} onValueChange={handleVehicleChange}>
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih armada..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicles.map((v) => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pilih Pengemudi */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Pengemudi / Operator</Label>
                            <Select value={driverId} onValueChange={setDriverId}>
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih supir..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Tanpa Pengemudi / Stasioner</SelectItem>
                                    {drivers.map((d) => (
                                        <SelectItem key={d.id} value={d.id}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Jenis Bahan Bakar */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Jenis BBM / Energi <span className="text-red-500">*</span>
                            </Label>
                            <Select value={fuelTypeId} onValueChange={setFuelTypeId}>
                                <SelectTrigger className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]">
                                    <SelectValue placeholder="Pilih bahan bakar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {fuelTypes.map((f) => (
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

                        {/* Jumlah Liter / kWh */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">
                                Jumlah ({isElectricity ? "kWh" : "Liter"}) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder={isElectricity ? "cth: 45.5" : "cth: 120.0"}
                                className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                value={liters}
                                onChange={(e) => setLiters(e.target.value)}
                                required
                            />
                        </div>

                        {/* Odometer */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Odometer Saat Isi (km)</Label>
                            <div className="relative">
                                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A72]" />
                                <Input
                                    type="number"
                                    placeholder="cth: 84520"
                                    className="h-10 pl-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                    value={odometerKm}
                                    onChange={(e) => setOdometerKm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Waktu Pengisian */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Waktu Transaksi</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A72]" />
                                <Input
                                    type="datetime-local"
                                    className="h-10 pl-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                                    value={loggedAt}
                                    onChange={(e) => setLoggedAt(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Calculation Preview Card */}
                    <div className="p-4 rounded-xl bg-[#1D6B5A]/5 border border-[#1D6B5A]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold text-[#1D6B5A] uppercase tracking-wider">
                                    Estimasi Emisi Gas Buang (Scope 1/2)
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold font-mono text-[#1D6B5A]">
                                    {estEmission.toLocaleString("id-ID")}
                                </span>
                                <span className="text-xs font-semibold text-[#1D6B5A]">kg CO₂e</span>
                            </div>
                            <p className="text-[10px] text-[#7A7A72]">
                                Rumus: {numLiters} {isElectricity ? "kWh" : "L"} × {selectedFuel?.emissionFactor || 2.68} kg CO₂/{selectedFuel?.unit || "L"} (IPCC)
                            </p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold text-[#1A1A18] uppercase tracking-wider">
                                    Estimasi Biaya Transaksi
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold font-mono text-[#1A1A18]">
                                    {estCost.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <p className="text-[10px] text-[#7A7A72]">
                                Tarif: {((selectedFuel?.pricePerUnit || 6800)).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })} / {selectedFuel?.unit || "L"}
                            </p>
                        </div>
                    </div>

                    {/* Catatan / SPBU */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">Lokasi SPBU / Catatan</Label>
                        <Input
                            placeholder="cth: SPBU Pertamina KM 19 Tol Jakarta-Cikampek / Stasiun Pengisian SPKLU"
                            className="h-9 text-xs bg-[#F7F5EF] border-[#DEDAD0]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#DEDAD0]/60">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-xs border-[#DEDAD0]">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#1D6B5A] hover:bg-[#1D6B5A]/90 text-white text-xs px-5 shadow-sm"
                        >
                            {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Catat Log BBM"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
