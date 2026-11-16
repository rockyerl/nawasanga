"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateVehicleType, useUpdateVehicleType } from "@/features/vehicle-type/hooks/vehicle-type-queries";
import { useFuelTypes } from "@/features/fuel-type/hooks/fuel-type-queries";
import { VehicleTypeTypes } from "@/types/features/vehicle-type.type";
import { CATEGORY_LABEL } from "@/features/vehicle-type/constants/vehicle-type.constants";

const CATEGORIES: VehicleTypeTypes.Service.Category[] = [
    "motorcycle",
    "car",
    "light_truck",
    "medium_truck",
    "heavy_truck",
    "bus",
    "heavy_equipment",
    "operational",
];

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: VehicleTypeTypes.Service.VehicleTypeData;
}

const emptyForm = {
    category:          "" as VehicleTypeTypes.Service.Category | "",
    name:              "",
    defaultFuelTypeId: "" as string | null,
    consumptionKm:     "",
    gvwMinTon:         "",
    description:       "",
};

export function VehicleTypeFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateVehicleType();
    const updateMutation = useUpdateVehicleType();
    const { data: fuelData } = useFuelTypes({ page: 1, itemPerPage: 100 });
    const fuelTypes = (((fuelData?.data as any)?.items || []) as Array<{ id: string; name: string }>);
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                category:          initialData.category,
                name:              initialData.name,
                defaultFuelTypeId: initialData.defaultFuelTypeId ?? "",
                consumptionKm:     String(initialData.consumptionKm),
                gvwMinTon:         initialData.gvwMinTon != null ? String(initialData.gvwMinTon) : "",
                description:       initialData.description,
            });
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.category)     e.category     = "Pilih kategori.";
        if (!form.name.trim())  e.name         = "Nama wajib diisi.";
        if (!form.consumptionKm || isNaN(Number(form.consumptionKm)) || Number(form.consumptionKm) <= 0)
            e.consumptionKm = "Masukkan nilai emisi yang valid (> 0).";
        if (form.gvwMinTon && isNaN(Number(form.gvwMinTon)))
            e.gvwMinTon = "Masukkan angka yang valid.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const payload = {
            category:          form.category as VehicleTypeTypes.Service.Category,
            name:              form.name.trim(),
            defaultFuelTypeId: form.defaultFuelTypeId || null,
            consumptionKm:     Number(form.consumptionKm),
            gvwMinTon:         form.gvwMinTon ? Number(form.gvwMinTon) : null,
            description:       form.description.trim(),
        };
        if (isEdit && initialData) {
            updateMutation.mutate({ id: initialData.id, payload }, { onSuccess: () => setOpen(false) });
        } else {
            createMutation.mutate(payload, { onSuccess: () => setOpen(false) });
        }
    };

    const fieldClass = (key: keyof typeof emptyForm) =>
        `border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Edit Tipe Kendaraan" : "Tambah Tipe Kendaraan"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">

                    {/* Kategori */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Kategori <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <Select value={form.category} onValueChange={set("category")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>{CATEGORY_LABEL[c] || c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.category}</p>}
                    </div>

                    {/* Nama */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama Tipe <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.name}
                            onChange={(e) => set("name")(e.target.value)}
                            placeholder="Truk Berat > 7.5 ton"
                            className={fieldClass("name")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.name && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.name}</p>}
                    </div>

                    {/* Bahan Bakar Default */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Bahan Bakar Default
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <Select value={form.defaultFuelTypeId ?? ""} onValueChange={set("defaultFuelTypeId")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder="Pilih bahan bakar" />
                            </SelectTrigger>
                            <SelectContent>
                                {fuelTypes.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Konsumsi / Emisi per km */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Emisi (kg CO₂/km) <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.consumptionKm}
                            onChange={(e) => set("consumptionKm")(e.target.value)}
                            placeholder="0.5500"
                            type="number"
                            step="0.0001"
                            min="0"
                            className={fieldClass("consumptionKm")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.consumptionKm && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.consumptionKm}</p>}
                    </div>

                    {/* GVW Min */}
                    <div className="space-y-1.5 col-span-2">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Min. Gross Vehicle Weight (ton)
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional — untuk truk/bus)</span>
                        </Label>
                        <input
                            value={form.gvwMinTon}
                            onChange={(e) => set("gvwMinTon")(e.target.value)}
                            placeholder="7.50"
                            type="number"
                            step="0.01"
                            min="0"
                            className={fieldClass("gvwMinTon")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.gvwMinTon && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.gvwMinTon}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Deskripsi
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <textarea
                            value={form.description}
                            onChange={(e) => set("description")(e.target.value)}
                            placeholder="Deskripsi singkat tipe kendaraan..."
                            maxLength={500}
                            rows={3}
                            className="w-full rounded-md border border-[#DEDAD0] px-3 py-2 text-sm outline-none resize-none focus:border-[#1D6B5A] transition-colors"
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        <p className="text-[10px]" style={{ color: "#7A7A72" }}>
                            {form.description.length}/500 karakter
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="text-sm"
                        style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="text-sm font-medium"
                        style={{ background: "#1D6B5A", color: "#F7F5EF" }}
                    >
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}