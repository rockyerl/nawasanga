"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, CheckCircle2, Clock, XCircle, Building2, ShieldCheck } from "lucide-react";

export interface InvoiceDetailData {
    id: string;
    invoiceNumber: string;
    organizationId?: string;
    companyName: string;
    companyAddress?: string;
    companyNpwp?: string;
    industry?: string;
    contactEmail?: string;
    contactPhone?: string;
    plan: string;
    amountIdr: number;
    amountFormatted: string;
    subtotalFormatted?: string;
    taxFormatted?: string;
    status: "paid" | "pending" | "failed" | string;
    paymentMethod?: string;
    createdAt: string;
    paidAt?: string | null;
    dueDate?: string;
}

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    invoice: InvoiceDetailData | null;
}

export function InvoiceViewerDialog({ open, setOpen, invoice }: Props) {
    const printAreaRef = useRef<HTMLDivElement>(null);

    if (!invoice) return null;

    const subtotal = invoice.subtotalFormatted || `Rp ${Math.round(invoice.amountIdr / 1.11).toLocaleString("id-ID")}`;
    const tax = invoice.taxFormatted || `Rp ${(invoice.amountIdr - Math.round(invoice.amountIdr / 1.11)).toLocaleString("id-ID")}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-6 bg-white border border-[#EDEAE0]">
                <DialogHeader className="pb-3 border-b border-[#EDEAE0] flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-base font-semibold text-[#1A1A18] flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#1D6B5A]" />
                            Faktur Pajak & Tagihan Resmi
                        </DialogTitle>
                        <p className="text-xs text-[#7A7A72] mt-0.5">
                            Dokumen bukti pembayaran sah platform Nawasanga Fuel & Carbon Monitoring
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handlePrint}
                            className="h-8 px-3 text-xs border-[#DEDAD0] text-[#1D6B5A] hover:bg-[#EEF5F3] flex items-center gap-1.5"
                        >
                            <Printer className="w-3.5 h-3.5 text-[#1D6B5A]" />
                            <span>Cetak / PDF</span>
                        </Button>
                    </div>
                </DialogHeader>

                {/* Printable Invoice Container */}
                <div ref={printAreaRef} className="space-y-6 pt-3 text-[#1A1A18]">
                    {/* Official Company Letterhead */}
                    <div className="flex items-start justify-between border-b border-[#EDEAE0] pb-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg bg-[#1D6B5A] flex items-center justify-center text-white font-black text-sm">
                                    N
                                </div>
                                <span className="font-bold text-base text-[#1D6B5A] tracking-tight">
                                    NAWASANGA FUEL & CARBON
                                </span>
                            </div>
                            <p className="text-[11px] text-[#7A7A72]">PT Nawasanga Solusi Nusantara</p>
                            <p className="text-[11px] text-[#7A7A72]">NPWP: 01.234.567.8-901.000</p>
                            <p className="text-[11px] text-[#7A7A72]">
                                Menara Satrio Lt. 18, Jl. Prof. Dr. Satrio Kav. C4, Jakarta Selatan 12950
                            </p>
                        </div>

                        <div className="text-right">
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    invoice.status === "paid"
                                        ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                                        : invoice.status === "pending"
                                        ? "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]"
                                        : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                                }`}
                            >
                                {invoice.status === "paid" ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                                        LUNAS (PAID)
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                                        MENUNGGU PEMBAYARAN
                                    </>
                                )}
                            </span>
                            <p className="text-sm font-mono font-bold text-[#1A1A18] mt-2">{invoice.invoiceNumber}</p>
                            <p className="text-[11px] text-[#7A7A72]">
                                Tanggal: {new Date(invoice.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>

                    {/* Bill To & Payment Info */}
                    <div className="grid grid-cols-2 gap-6 text-xs bg-[#F7F5EF] p-4 rounded-xl border border-[#EDEAE0]">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A7A72] mb-1">
                                Tagihan Ditujukan Kepada:
                            </p>
                            <p className="font-bold text-sm text-[#1A1A18]">{invoice.companyName}</p>
                            <p className="text-[#7A7A72] mt-0.5">{invoice.companyAddress || "Alamat kantor terdaftar"}</p>
                            <p className="text-[#7A7A72]">Email: {invoice.contactEmail || "admin@perusahaan.com"}</p>
                            <p className="text-[#7A7A72]">NPWP: {invoice.companyNpwp || "01.234.567.8-000.000"}</p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A7A72] mb-1">
                                Rincian Pembayaran:
                            </p>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-[#7A7A72]">Metode Bayar:</span>
                                    <span className="font-medium text-[#1A1A18]">{invoice.paymentMethod || "Bank Transfer BCA"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A7A72]">Paket Langganan:</span>
                                    <span className="font-semibold text-[#1D6B5A] uppercase">{invoice.plan} Fleet</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A7A72]">Jatuh Tempo:</span>
                                    <span className="font-medium text-[#1A1A18]">
                                        {invoice.dueDate
                                            ? new Date(invoice.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                            : "14 Hari setelah terbit"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-[#EDEAE0] rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                            <thead className="bg-[#EDEAE0]/50 text-[#1A1A18] font-semibold border-b border-[#EDEAE0]">
                                <tr>
                                    <th className="text-left px-4 py-2.5">Deskripsi Layanan</th>
                                    <th className="text-center px-4 py-2.5">Periode</th>
                                    <th className="text-right px-4 py-2.5">Jumlah (IDR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDEAE0]">
                                <tr>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-[#1A1A18]">
                                            Langganan Platform Nawasanga - Tier {invoice.plan.toUpperCase()}
                                        </p>
                                        <p className="text-[11px] text-[#7A7A72] mt-0.5">
                                            Pemantauan log BBM armada, kalkulasi emisi Scope 1 IPCC, telematika GPS & laporan kepatuhan.
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[#7A7A72]">Tahunan</td>
                                    <td className="px-4 py-3 text-right font-medium text-[#1A1A18]">{subtotal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Breakdown */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2 text-xs">
                            <div className="flex justify-between text-[#7A7A72]">
                                <span>Dasar Pengenaan Pajak (DPP):</span>
                                <span className="font-medium text-[#1A1A18]">{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-[#7A7A72]">
                                <span>PPN 11%:</span>
                                <span className="font-medium text-[#1A1A18]">{tax}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-[#1A1A18] border-t border-[#EDEAE0] pt-2">
                                <span>Total Pembayaran:</span>
                                <span className="text-[#1D6B5A]">{invoice.amountFormatted}</span>
                            </div>
                        </div>
                    </div>

                    {/* Official Stamp & Note */}
                    <div className="border-t border-[#EDEAE0] pt-4 flex items-center justify-between text-[11px] text-[#7A7A72]">
                        <div>
                            <p className="font-medium text-[#1A1A18]">Rekening Pembayaran Resmi:</p>
                            <p>Bank Central Asia (BCA) - KCU Kuningan</p>
                            <p className="font-mono font-semibold text-[#1A1A18]">No. Rekening: 8890-1234-5678-9012</p>
                            <p>a/n PT Nawasanga Solusi Nusantara</p>
                        </div>

                        <div className="text-right">
                            <div className="inline-block border-2 border-[#1D6B5A] text-[#1D6B5A] px-3 py-1 rounded font-bold text-[10px] tracking-widest uppercase rotate-[-3deg]">
                                VALIDATED &bull; NAWASANGA
                            </div>
                            <p className="text-[10px] text-[#7A7A72] mt-1">Faktur elektronik sah sesuai regulasi DJP</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#EDEAE0] mt-4">
                    <Button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-xs rounded-lg px-5 bg-[#1D6B5A] hover:bg-[#175749] text-white"
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
