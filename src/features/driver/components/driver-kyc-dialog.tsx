"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Clock, User, Award, Truck, Fuel, CheckCircle, XCircle } from "lucide-react";
import type { DriverData, DriverKycStatus } from "@/types/features/driver.type";
import { useUpdateDriver } from "@/features/driver/hooks/driver-queries";
import { toast } from "sonner";

interface DriverKycDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  driver: DriverData | null;
}

export function DriverKycDialog({ open, setOpen, driver }: DriverKycDialogProps) {
  const updateMutation = useUpdateDriver();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!driver) return null;

  const expiry = driver.licenseExpiry ? new Date(driver.licenseExpiry) : null;
  const isExpired = expiry ? expiry < new Date() : false;
  const isExpiringSoon = expiry ? expiry <= new Date(Date.now() + 90 * 24 * 3600 * 1000) : false;

  const handleUpdateKyc = (status: DriverKycStatus) => {
    updateMutation.mutate(
      {
        id: driver.id,
        payload: {
          kycStatus: status,
          notes: status === "rejected" ? `KYC Ditolak: ${rejectReason || "Dokumen belum memenuhi syarat"}` : driver.notes,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            status === "verified"
              ? `Status KYC ${driver.name} berhasil diverifikasi!`
              : `Status KYC ${driver.name} telah ditolak.`
          );
          setOpen(false);
          setShowRejectInput(false);
          setRejectReason("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
        <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-[#1D6B5A]/10 flex items-center justify-center text-[#1D6B5A]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Verifikasi KYC & Dokumen Pengemudi
                </DialogTitle>
                <DialogDescription className="text-xs text-[#7A7A72]">
                  Tinjau data identitas legal, masa berlaku lisensi, dan riwayat armada driver.
                </DialogDescription>
              </div>
            </div>

            {/* Current Badge */}
            {driver.kycStatus === "verified" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
              </span>
            ) : driver.kycStatus === "pending" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="h-3.5 w-3.5" /> Menunggu Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldAlert className="h-3.5 w-3.5" /> Ditolak / Tidak Sah
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Nama Lengkap
              </span>
              <p className="text-sm font-semibold text-gray-900">{driver.name}</p>
              <span className="text-xs text-[#7A7A72] mt-0.5 block">{driver.employeeId}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Nomor Induk Kependudukan (NIK)
              </span>
              <p className="text-sm font-semibold font-mono text-gray-900">{driver.nik || "3201041988020004"}</p>
              <span className="text-xs text-emerald-600 mt-0.5 block">e-KTP Terdaftar Dukcapil</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Kontak & WhatsApp
              </span>
              <p className="text-sm font-semibold text-gray-900">{driver.phone || driver.phoneNumber || "-"}</p>
              <span className="text-xs text-[#7A7A72] mt-0.5 block">{driver.locationName || "Pool Cikarang"}</span>
            </div>
          </div>

          {/* SIM & License Details Card */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-[#F7F5EF]/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#1D6B5A]" />
                Surat Izin Mengemudi (SIM / SIO)
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1D6B5A]/10 text-[#1D6B5A]">
                {driver.licenseType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#7A7A72] block">Nomor Registrasi Lisensi:</span>
                <span className="font-mono font-semibold text-gray-900 text-sm">{driver.licenseNumber}</span>
              </div>
              <div>
                <span className="text-[#7A7A72] block">Masa Berlaku Lisensi:</span>
                <span className={`font-semibold ${isExpired ? "text-red-600" : isExpiringSoon ? "text-amber-600" : "text-gray-900"}`}>
                  {expiry ? expiry.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "Tidak ditentukan"}
                  {isExpired && " (Kadaluarsa)"}
                  {!isExpired && isExpiringSoon && " (Segera Kadaluarsa < 90 hari)"}
                </span>
              </div>
            </div>
          </div>

          {/* Operational & Telematics Integration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#7A7A72] block">Armada Tertaut</span>
                <span className="text-sm font-bold text-gray-800">
                  {driver.assignedVehiclePlate || "Belum Ditugaskan"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Fuel className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#7A7A72] block">Riwayat Transaksi BBM</span>
                <span className="text-sm font-bold text-gray-800">
                  {driver.fuelLogCount || 0} Pengisian ({driver.totalLiters || 0} L)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#7A7A72] block">Jejak Emisi Tercatat</span>
                <span className="text-sm font-bold text-gray-800">
                  {driver.totalCo2Kg || 0} kg CO₂e
                </span>
              </div>
            </div>
          </div>

          {/* Reject Note Section if needed */}
          {showRejectInput && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <label className="text-xs font-semibold text-rose-800 block">
                Alasan Penolakan KYC / Catatan Koreksi
              </label>
              <textarea
                placeholder="Tuliskan catatan kekurangan berkas atau alasan penolakan..."
                className="w-full min-h-[60px] p-2 text-xs rounded border border-rose-300 bg-white focus:outline-none"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowRejectInput(false)} className="text-xs">
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                  onClick={() => handleUpdateKyc("rejected")}
                  disabled={updateMutation.isPending}
                >
                  Konfirmasi Tolak KYC
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDEAE0]">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs border-[#DEDAD0]">
              Tutup
            </Button>

            <div className="flex items-center gap-2">
              {!showRejectInput && driver.kycStatus !== "rejected" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectInput(true)}
                  className="text-xs border-rose-300 text-rose-600 hover:bg-rose-50"
                  disabled={updateMutation.isPending}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Tolak KYC
                </Button>
              )}

              {driver.kycStatus !== "verified" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateKyc("verified")}
                  className="bg-[#1D6B5A] hover:bg-[#155245] text-white text-xs shadow-sm"
                  disabled={updateMutation.isPending}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {updateMutation.isPending ? "Memproses..." : "Setujui & Verifikasi KYC"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
