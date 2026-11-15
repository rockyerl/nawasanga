"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromoTypes } from "@/types/features/promo.type";
import { ImagePlus, Calendar } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: PromoTypes.Service.PromoData;
}

export function PromoFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const [form, setForm] = useState<Partial<PromoTypes.Service.PromoData>>({
        title: "",
        code: "",
        discountType: "persen",
        discountValue: 0,
        status: "aktif",
    });

    useEffect(() => {
        if (open && initialData) setForm(initialData);
        else if (open) setForm({ discountType: "persen", status: "aktif" });
    }, [open, initialData]);

    const fieldClass = "border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors border-[#DEDAD0] focus:border-[#1D6B5A] bg-[#F7F5EF]";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">{isEdit ? "Edit Promo" : "Buat Promo Baru"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Banner Upload Placeholder */}
                    <div className="col-span-2 border-2 border-dashed border-[#DEDAD0] rounded-lg p-8 flex flex-col items-center justify-center bg-[#F7F5EF] cursor-pointer hover:bg-[#F0EEE6] transition-colors">
                        <ImagePlus className="text-[#7A7A72] mb-2" size={24} />
                        <span className="text-xs text-[#7A7A72]">Klik untuk unggah Banner Promo (1200x600px)</span>
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium">Judul Promo</Label>
                        <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={fieldClass} placeholder="Contoh: Promo Ramadhan Berkah" />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Kode Promo</Label>
                        <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} className={fieldClass} placeholder="RAMADHAN2026" />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Status</Label>
                        <Select value={form.status} onValueChange={(v: any) => setForm({...form, status: v})}>
                            <SelectTrigger className="bg-[#F7F5EF] border-[#DEDAD0] text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="non-aktif">Non-Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Tipe Diskon</Label>
                        <Select value={form.discountType} onValueChange={(v: any) => setForm({...form, discountType: v})}>
                            <SelectTrigger className="bg-[#F7F5EF] border-[#DEDAD0] text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="persen">Persentase (%)</SelectItem>
                                <SelectItem value="nominal">Nominal (Rp)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Nilai Potongan</Label>
                        <input type="number" value={form.discountValue} onChange={(e) => setForm({...form, discountValue: Number(e.target.value)})} className={fieldClass} />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Tanggal Mulai</Label>
                        <div className="relative">
                            <input type="date" className={fieldClass} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Tanggal Berakhir</Label>
                        <div className="relative">
                            <input type="date" className={fieldClass} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#EDEAE0]">
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button onClick={() => setOpen(false)} style={{ background: "#1D6B5A", color: "#F7F5EF" }}>
                        {isEdit ? "Simpan Perubahan" : "Simpan Promo"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}