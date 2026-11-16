"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Award, Printer, CheckCircle, QrCode } from "lucide-react";

interface AuditCertificateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizationName?: string;
  totalTonCO2e?: number;
  periodYear?: string;
}

export function AuditCertificateDialog({
  open,
  setOpen,
  organizationName = "PT Sinergi Logistik Nusantara",
  totalTonCO2e = 48.2,
  periodYear = "2026",
}: AuditCertificateDialogProps) {
  const certNumber = `NWS-ISO14064-${periodYear}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[95vh] overflow-y-auto p-0 border-0 bg-transparent shadow-2xl">
        {/* Certificate Container with Gold/Teal Luxury Rimba Border */}
        <div className="relative bg-[#FDFCF7] border-8 border-[#4A3728] p-8 sm:p-12 text-[#1A1A18] rounded-xl shadow-2xl overflow-hidden print:p-0 print:border-4">
          {/* Subtle Watermark Mandala Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg width="450" height="450" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#1D6B5A" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" stroke="#B8962E" strokeWidth="1.5" />
              <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="#1D6B5A" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b-2 border-[#DEDAD0] pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1D6B5A] text-[#F7F5EF] flex items-center justify-center shadow-md">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-[#1D6B5A] block">
                  NAWASANGA
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7A72] block font-semibold">
                  Carbon Accounting & ESG Verification
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1D6B5A]/10 text-[#1D6B5A] border border-[#1D6B5A]/20">
                <ShieldCheck className="h-4 w-4" /> ISO 14064-1:2018
              </span>
              <span className="block text-[11px] font-mono text-[#7A7A72] mt-1">
                No. Reg: {certNumber}
              </span>
            </div>
          </div>

          {/* Main Certificate Title */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A18] uppercase">
              Sertifikat Verifikasi Inventarisasi Emisi GRK
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#B8962E] font-semibold">
              Statement of Greenhouse Gas Emissions Audit
            </p>
            <p className="text-xs text-[#7A7A72] max-w-lg mx-auto pt-1 leading-relaxed">
              Diterbitkan berdasarkan audit independen telematika konsumsi bahan bakar armada dan mesin operasional sesuai metodologi IPCC 2006 dan Standar Kepatuhan POJK No. 51/POJK.03/2017.
            </p>
          </div>

          {/* Certified Recipient */}
          <div className="my-8 text-center space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#7A7A72] font-medium block">
              Diberikan Kepada Organisasi:
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1D6B5A] tracking-wide underline underline-offset-8 decoration-[#B8962E]">
              {organizationName}
            </h2>
          </div>

          {/* Emitted Carbon Metric Highlight Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 p-6 rounded-xl bg-white border border-[#EDEAE0] shadow-xs">
            <div className="text-center border-b sm:border-b-0 sm:border-r border-[#EDEAE0] pb-3 sm:pb-0">
              <span className="text-[11px] uppercase tracking-wider text-[#7A7A72] font-semibold block mb-1">
                Total Emisi Langsung (Scope 1)
              </span>
              <span className="text-3xl font-extrabold text-[#1D6B5A] font-serif">
                {totalTonCO2e} <span className="text-sm font-sans font-normal text-gray-600">tCO₂e</span>
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Terkalibrasi Akurat</span>
            </div>

            <div className="text-center border-b sm:border-b-0 sm:border-r border-[#EDEAE0] pb-3 sm:pb-0">
              <span className="text-[11px] uppercase tracking-wider text-[#7A7A72] font-semibold block mb-1">
                Cakupan Verifikasi
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-1">
                Armada Bergerak &amp; Alat Berat
              </span>
              <span className="text-[11px] text-[#7A7A72] block mt-0.5">Mobile Combustion Fleet</span>
            </div>

            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#7A7A72] font-semibold block mb-1">
                Tingkat Kepastian (Assurance)
              </span>
              <span className="text-sm font-bold text-[#B8962E] block mt-1 flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4" /> Wajar Tanpa Pengecualian
              </span>
              <span className="text-[11px] text-[#7A7A72] block mt-0.5">Reasonable Assurance Level</span>
            </div>
          </div>

          {/* Signatures & QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-[#DEDAD0] pt-6 mt-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 p-2 bg-white border border-[#DEDAD0] rounded-lg flex flex-col items-center justify-center text-center">
                <QrCode className="h-12 w-12 text-[#1D6B5A]" />
                <span className="text-[8px] font-mono text-[#7A7A72] mt-0.5">VERIF-VALID</span>
              </div>
              <div className="text-xs text-[#7A7A72] space-y-0.5">
                <span className="block font-semibold text-gray-900">Validitas Digital Terdaftar</span>
                <span className="block text-[11px]">Sistem Registri Nasional (SRN-PPI) ID: SRN-NWS-{periodYear}</span>
                <span className="block text-[11px]">Audit Tanggal: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="h-12 w-28 border-b border-[#1A1A18] flex items-end justify-center pb-1">
                  <span className="font-serif italic text-sm text-[#1D6B5A]">Bambang E.</span>
                </div>
                <span className="text-[10px] font-bold text-gray-900 block mt-1">Lead ESG Verifier</span>
                <span className="text-[9px] text-[#7A7A72] block">Nawasanga Audit Bureau</span>
              </div>

              <div>
                <div className="h-12 w-28 border-b border-[#1A1A18] flex items-end justify-center pb-1">
                  <span className="font-serif italic text-sm text-[#1D6B5A]">Dr. Hendra P.</span>
                </div>
                <span className="text-[10px] font-bold text-gray-900 block mt-1">Managing Director</span>
                <span className="text-[9px] text-[#7A7A72] block">Sundawa Engineering</span>
              </div>
            </div>
          </div>

          {/* Action Bar (Hidden when printed) */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-[#EDEAE0] print:hidden">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs border-[#DEDAD0]">
              Tutup
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-[#1D6B5A] hover:bg-[#155245] text-white text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak / Simpan PDF Sertifikat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
