"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ASSET_TYPES = ["Excavator", "Genset", "Forklift", "Pompa", "Crane", "Compressor"];
const FUEL_TYPES = ["Pertalite", "Pertamax", "Solar", "Bio Solar", "Dexlite"];
const LOCATIONS = ["Jakarta", "Bandung", "Surabaya", "Kalimantan Site A", "Sumatera Site B"];
const STATUSES = [
    { label: "Aktif", value: "Aktif", color: "#22c55e" },
    { label: "Tidak Aktif", value: "Tidak Aktif", color: "#f97316" },
    { label: "Maintenance", value: "Maintenance", color: "#3b82f6" }
];

export function AssetFormDialog({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Tambah Aset</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Nama</Label>
                        <Input placeholder="Nama aset" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tipe</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                            <SelectContent>{ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Jenis BBM (Dropdown Cari)</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Cari jenis BBM..." /></SelectTrigger>
                            <SelectContent>{FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Nomor Seri</Label>
                        <Input placeholder="Input serial number" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Daya (KW)</Label>
                        <Input type="number" placeholder="Daya dalam KW" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Lokasi (Dropdown Cari)</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Cari lokasi..." /></SelectTrigger>
                            <SelectContent>{LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Konsumsi BBM (Liter/Jam)</Label>
                        <Input type="number" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Status</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                            <SelectContent>
                                {STATUSES.map(s => (
                                    <SelectItem key={s.value} value={s.value}>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.label}
                    </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label>Catatan</Label>
                        <textarea
                            placeholder="Tambahkan catatan di sini..."
                            className="w-full min-h-[80px] rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-[#29A2A5] outline-none resize-none"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button className="bg-[#29A2A5] hover:bg-[#29A2A5]/90 text-white" onClick={() => setOpen(false)}>Simpan</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}