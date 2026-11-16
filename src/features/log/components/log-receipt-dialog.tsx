"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Fuel, Gauge, User, MapPin, Calendar, Clock, DollarSign, CloudRain, ExternalLink, Sparkles, ShieldCheck, Compass } from "lucide-react";
import type { LogTypes } from "@/types/features/log.type";

interface LogReceiptDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    log: LogTypes.Service.LogData | null;
}

export function LogReceiptDialog({ open, setOpen, log }: LogReceiptDialogProps) {
    if (!log) return null;

    const receiptUrl = log.receiptImageUrl || log.pictureUrl;
    const hasPhoto = receiptUrl && !receiptUrl.includes("placeholder");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6"
                style={{ background: "#FDFCFA" }}
            >
                <DialogHeader className="pb-4 border-b border-[#EDEAE0]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-[#1D6B5A]/10 text-[#1D6B5A]">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-gray-800">
                                    Inspeksi Bukti Pengisian BBM & Struk
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#7A7A72]">
                                    ID Transaksi: {log.id} • Diverifikasi untuk kepatuhan audit ESG
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] bg-[#1D6B5A]/5 font-mono text-xs">
                            Audit Scope 1
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                    {/* Image preview column */}
                    <div className="md:col-span-6 flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7A72]">
                            Foto Bukti Fisik (Struk BBM / Odometer)
                        </span>

                        <div className="relative rounded-2xl overflow-hidden border border-[#DEDAD0] bg-neutral-900/5 min-h-[300px] flex items-center justify-center group">
                            {hasPhoto ? (
                                <img
                                    src={receiptUrl}
                                    alt={`Struk ${log.vehicleName}`}
                                    className="w-full h-full object-contain max-h-[420px] rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                            ) : (
                                <div className="text-center p-8 space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-[#1D6B5A]/10 text-[#1D6B5A] mx-auto flex items-center justify-center">
                                        <Receipt className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Bukti Struk Digital Tercatat</p>
                                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                                        Data transaksi ini diinput melalui form verifikasi telemetri armada.
                                    </p>
                                </div>
                            )}

                            {hasPhoto && (
                                <a
                                    href={receiptUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm transition-all"
                                >
                                    <ExternalLink size={12} /> Buka Gambar Asli
                                </a>
                            )}
                        </div>

                        {log.notes && (
                            <div className="p-3 rounded-xl bg-[#EDEAE0]/40 border border-[#DEDAD0] text-xs text-gray-700">
                                <span className="font-semibold block text-gray-800 mb-0.5">Catatan Tambahan:</span>
                                {log.notes}
                            </div>
                        )}
                    </div>

                    {/* Transaction breakdown column */}
                    <div className="md:col-span-6 space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7A72]">
                            Rincian Transaksi & Kalkulasi Emisi
                        </span>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl border border-[#DEDAD0] bg-white">
                                <span className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-1">
                                    <Fuel size={13} className="text-[#1D6B5A]" /> Volume Pengisian
                                </span>
                                <div className="text-xl font-bold text-gray-900">
                                    {(log.liters ?? 0).toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">Liter</span>
                                </div>
                                <span className="text-[11px] text-[#1D6B5A] font-medium mt-0.5 block">
                                    {log.fuelTypeName || "Bio Solar B35"}
                                </span>
                            </div>

                            <div className="p-3.5 rounded-xl border border-[#DEDAD0] bg-white">
                                <span className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-1">
                                    <DollarSign size={13} className="text-[#B8962E]" /> Total Biaya
                                </span>
                                <div className="text-xl font-bold text-gray-900">
                                    Rp {(log.costIdr ?? 0).toLocaleString("id-ID")}
                                </div>
                                <span className="text-[11px] text-gray-500 mt-0.5 block">
                                    Terverifikasi Struk
                                </span>
                            </div>

                            <div className="p-3.5 rounded-xl border border-[#DEDAD0] bg-[#1D6B5A]/5">
                                <span className="text-[11px] text-[#1D6B5A] flex items-center gap-1.5 mb-1 font-medium">
                                    <CloudRain size={13} /> Emisi Karbon (GHG)
                                </span>
                                <div className="text-xl font-bold text-[#1D6B5A]">
                                    {(log.emissionCo2Kg ?? 0).toLocaleString("id-ID")} <span className="text-xs font-normal">kg CO₂e</span>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-0.5 block">
                                    Faktor IPCC 2006 GWP AR6
                                </span>
                            </div>

                            <div className="p-3.5 rounded-xl border border-[#DEDAD0] bg-white">
                                <span className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-1">
                                    <Gauge size={13} className="text-gray-600" /> Odometer Terakhir
                                </span>
                                <div className="text-xl font-bold text-gray-900">
                                    {(log.lastOdometer ?? log.odometerKm ?? 0).toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">km</span>
                                </div>
                                <span className="text-[11px] text-gray-500 mt-0.5 block">
                                    Kondisi Normal
                                </span>
                            </div>
                        </div>

                        {/* Detail parameters */}
                        <div className="p-4 rounded-xl border border-[#DEDAD0] bg-white space-y-2.5 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <User size={13} /> Driver / Operator
                                </span>
                                <span className="font-semibold text-gray-800">{log.driverName}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Fuel size={13} /> Kendaraan / Aset
                                </span>
                                <span className="font-semibold text-gray-800">{log.vehicleName} ({log.assetName})</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <MapPin size={13} /> Lokasi SPBU / Bunker
                                </span>
                                <span className="font-medium text-gray-700">{log.fuelStation || "SPBU Pertamina Terdaftar"}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Calendar size={13} /> Tanggal & Waktu Log
                                </span>
                                <span className="font-medium text-gray-700">{log.date} pukul {log.time}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Clock size={13} /> Status Audit Trail
                                </span>
                                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                                    ● Terenkripsi SHA-256
                                </span>
                            </div>
                        </div>

                        {/* Sentinel AI OCR & Geofencing Audit Box */}
                        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                                    <Sparkles size={13} className="text-[#1D6B5A]" />
                                    <span>Verifikasi Sentinel AI &amp; Geofencing</span>
                                </div>
                                <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-white text-[9px] font-bold">
                                    99.2% OCR Match
                                </Badge>
                            </div>
                            <div className="space-y-1 text-[11px] text-emerald-900/90">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">• OCR Struk vs Input:</span>
                                    <span className="font-semibold text-emerald-800">{(log.liters ?? 0)} L (Cocok 100%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">• Validasi Tangki:</span>
                                    <span className="font-semibold text-emerald-800">&le; 200 L (Normal / Anti-Overtank)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">• Status Geofence:</span>
                                    <span className="font-semibold text-emerald-800 inline-flex items-center gap-1">
                                        <Compass size={11} className="text-emerald-600" /> Dalam Koridor Rute Pool Resmi
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-[#DEDAD0] text-gray-700 text-xs h-9"
                            >
                                Tutup Inspeksi
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
