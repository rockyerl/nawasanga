"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Printer, Copy, ExternalLink, Fuel, Truck, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

interface AssetQrDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  asset: {
    id: string;
    name: string;
    brandModel: string;
    plateNumber: string;
    type?: string;
    category?: string;
    fuelType?: string;
    location?: string;
    organizationId?: string;
    organizationName?: string;
  } | null;
}

export function AssetQrDialog({ open, setOpen, asset }: AssetQrDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!asset) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nawasanga.id";
  const driverLogUrl = `${origin}/driver-log?vehicleId=${asset.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(driverLogUrl)}&color=1D6B5A&bgcolor=FFFFFF`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(driverLogUrl);
    toast.success("Tautan Driver Log berhasil disalin ke clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6"
        style={{ background: "#FDFCFA" }}
      >
        <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#1D6B5A]/10 text-[#1D6B5A]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Label Stiker QR Telemetri Armada
                </DialogTitle>
                <DialogDescription className="text-xs text-[#7A7A72]">
                  Cetak dan tempelkan stiker QR ini pada kaca dasbor kendaraan atau tangki alat berat.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] bg-[#1D6B5A]/5 font-mono text-xs">
              Scan-to-Log Ready
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-3">
          {/* Sticker Preview Column */}
          <div className="md:col-span-7 flex flex-col items-center">
            {/* The Printable Sticker Badge Card */}
            <div 
              ref={printRef}
              id="printable-sticker"
              className="w-full max-w-sm rounded-2xl border-2 border-[#1D6B5A] bg-white p-5 shadow-md text-neutral-900 relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
              }}
            >
              {/* Sticker Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-[#1D6B5A] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D6B5A] text-white flex items-center justify-center font-bold text-xs">
                    N
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#1D6B5A] leading-tight truncate max-w-[180px]">
                      {asset.organizationName || "NAWASANGA FLEET"}
                    </div>
                    <div className="text-[9px] text-[#7A7A72] font-semibold leading-none">
                      Telemetri Smart Asset QR
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1D6B5A]/10 text-[#1D6B5A] font-bold">
                  SCOPE 1
                </span>
              </div>

              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-xl border border-[#EDEAE0] shadow-inner flex flex-col items-center justify-center mb-4">
                <img
                  src={qrImageUrl}
                  alt={`QR ${asset.plateNumber}`}
                  className="w-44 h-44 object-contain rounded-lg"
                  loading="eager"
                />
                <span className="text-[9px] text-[#7A7A72] font-mono mt-1 tracking-wider uppercase">
                  ID: {asset.id}
                </span>
              </div>

              {/* Vehicle Specifications */}
              <div className="space-y-2 border-t border-[#EDEAE0] pt-3 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#7A7A72] text-[11px] font-medium">Perusahaan:</span>
                  <span className="font-bold text-[#1D6B5A] text-[11px] truncate max-w-[180px]">
                    {asset.organizationName || "PT Nusantara Logistik"}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[#7A7A72] text-[11px] font-medium">Nomor Polisi:</span>
                  <span className="font-mono text-base font-extrabold text-gray-900">
                    {asset.plateNumber}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[#7A7A72] text-[11px] font-medium">Model / Tipe:</span>
                  <span className="font-semibold text-gray-800 text-[11px] truncate max-w-[180px]">
                    {asset.brandModel || asset.name}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[#7A7A72] text-[11px] font-medium">Jenis Bahan Bakar:</span>
                  <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] text-[10px] font-bold py-0 h-4">
                    {asset.fuelType || "Bio Solar B35"}
                  </Badge>
                </div>
              </div>

              {/* Driver Instruction Footer */}
              <div className="mt-4 pt-2.5 border-t-2 border-dashed border-[#1D6B5A]/30 text-center">
                <p className="text-[10px] font-bold text-[#1D6B5A] leading-tight">
                  ARAHKAN KAMERA HP UNTUK CATAT BBM
                </p>
                <p className="text-[9px] text-[#7A7A72] mt-0.5">
                  Foto Struk &amp; Odometer Terverifikasi Langsung
                </p>
              </div>
            </div>
          </div>

          {/* Action & Explanation Column */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#EDEAE0]/40 border border-[#DEDAD0] space-y-2 text-xs">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#1D6B5A]" /> Cara Kerja &amp; Otorisasi Supir
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-gray-600 leading-relaxed text-[11px]">
                  <li>
                    Cetak stiker dan tempelkan pada kaca dasbor unit armada atau dekat tangki bahan bakar.
                  </li>
                  <li>
                    <strong>Supir Tidak Perlu Login:</strong> Pengemudi cukup memindai QR Code stiker dengan kamera smartphone.
                  </li>
                  <li>
                    <strong>Otomatis Terikat ke Perusahaan:</strong> Sistem mengidentifikasi kepemilikan armada (PT Anda) langsung dari kode unik fisik kendaraan pada QR.
                  </li>
                  <li>
                    Browser smartphone akan langsung membuka <strong>Driver Mobile Log</strong> dengan plat nomor, data PT, dan jenis bahan bakar yang terisi otomatis.
                  </li>
                  <li>
                    Pengemudi mengambil foto struk kasir, foto odometer, mengisi liter, lalu klik Kirim (selesai dalam 20 detik tanpa repot username/password).
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl border border-[#DEDAD0] bg-white space-y-1.5">
                <span className="text-[11px] text-gray-500 font-medium block">Tautan Langsung Driver Log:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={driverLogUrl}
                    className="w-full text-[11px] font-mono bg-neutral-100 p-2 rounded border border-neutral-200 text-gray-700 truncate select-all"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-8 px-2.5 text-xs shrink-0"
                    title="Salin Tautan"
                  >
                    <Copy size={13} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handlePrint}
                className="w-full h-10 bg-[#1D6B5A] hover:bg-[#175749] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={14} /> Cetak Stiker QR Armada (Print / PDF)
              </Button>

              <a
                href={driverLogUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full h-9 rounded-md border border-[#DEDAD0] bg-white hover:bg-neutral-50 text-gray-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                Buka Form Driver Log di Tab Baru <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
