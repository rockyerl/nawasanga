"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateFuelType, useUpdateFuelType } from "@/features/fuel-type/hooks/fuel-type-queries";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";
import { UNIT_LABEL } from "@/features/fuel-type/constants/fuel-type.constants";

const UNITS: FuelTypeTypes.Service.Unit[] = ["liter", "m3", "kwh"];

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: FuelTypeTypes.Service.FuelTypeData;
}

const emptyForm = {
    name:           "",
    code:           "",
    emissionFactor: "",
    unit:           "" as FuelTypeTypes.Service.Unit | "",
    pricePerUnit:   "",
    isActive:       true,
    source:         "",
};

export function FuelTypeFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateFuelType();
    const updateMutation = useUpdateFuelType();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name:           initialData.name,
                code:           initialData.code,
                emissionFactor: String(initialData.emissionFactor),
                unit:           initialData.unit,
                pricePerUnit:   String(initialData.pricePerUnit),
                isActive:       initialData.isActive,
                source:         initialData.source,
            });
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string | boolean) =>
        setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim())  e.name = "Nama wajib diisi.";
        if (!form.code.trim())  e.code = "Kode wajib diisi.";
        if (!form.unit)         e.unit = "Pilih satuan.";
        if (!form.emissionFactor || isNaN(Number(form.emissionFactor)) || Number(form.emissionFactor) <= 0)
            e.emissionFactor = "Masukkan faktor emisi yang valid (> 0).";
        if (!form.pricePerUnit || isNaN(Number(form.pricePerUnit)) || Number(form.pricePerUnit) < 0)
            e.pricePerUnit = "Masukkan harga yang valid (≥ 0).";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const payload = {
            name:           form.name.trim(),
            code:           form.code.trim().toLowerCase(),
            emissionFactor: Number(form.emissionFactor),
            unit:           form.unit as FuelTypeTypes.Service.Unit,
            pricePerUnit:   Number(form.pricePerUnit),
            isActive:       form.isActive,
            source:         form.source.trim(),
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
                        {isEdit ? "Edit Bahan Bakar" : "Tambah Bahan Bakar"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">

                    {/* Nama */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Nama <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.name}
                            onChange={(e) => set("name")(e.target.value)}
                            placeholder="Solar / Diesel"
                            className={fieldClass("name")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.name && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.name}</p>}
                    </div>

                    {/* Kode */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Kode <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.code}
                            onChange={(e) => set("code")(e.target.value)}
                            placeholder="solar"
                            className={fieldClass("code")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.code && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.code}</p>}
                    </div>

                    {/* Satuan */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Satuan <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <Select value={form.unit} onValueChange={set("unit")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue placeholder="Pilih satuan" />
                            </SelectTrigger>
                            <SelectContent>
                                {UNITS.map((u) => (
                                    <SelectItem key={u} value={u}>{UNIT_LABEL[u]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.unit && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.unit}</p>}
                    </div>

                    {/* Faktor Emisi */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Faktor Emisi (kg CO₂) <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.emissionFactor}
                            onChange={(e) => set("emissionFactor")(e.target.value)}
                            placeholder="2.6800"
                            type="number"
                            step="0.0001"
                            min="0"
                            className={fieldClass("emissionFactor")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.emissionFactor && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.emissionFactor}</p>}
                    </div>

                    {/* Harga */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Harga per Satuan (Rp) <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.pricePerUnit}
                            onChange={(e) => set("pricePerUnit")(e.target.value)}
                            placeholder="14500"
                            type="number"
                            step="0.01"
                            min="0"
                            className={fieldClass("pricePerUnit")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.pricePerUnit && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.pricePerUnit}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>Status</Label>
                        <Select
                            value={form.isActive ? "true" : "false"}
                            onValueChange={(v) => set("isActive")(v === "true")}
                        >
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Aktif</SelectItem>
                                <SelectItem value="false">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Referensi */}
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Referensi Standar
                            <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>(opsional)</span>
                        </Label>
                        <input
                            value={form.source}
                            onChange={(e) => set("source")(e.target.value)}
                            placeholder="IPCC 2006"
                            className={fieldClass("source")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
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