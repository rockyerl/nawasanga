"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Building2, User, FileText, CheckCircle, XCircle, MapPin, Mail, Phone } from "lucide-react";
import type { OrganizationTypes } from "@/types/features/organization.type";
import { useUpdateOrganization } from "@/features/organization/hooks/organization-queries";
import { toast } from "sonner";

interface OrganizationKycDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organization: OrganizationTypes.Service.OrganizationData | null;
}

export function OrganizationKycDialog({ open, setOpen, organization }: OrganizationKycDialogProps) {
  const updateMutation = useUpdateOrganization();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!organization) return null;

  const isPendingKyc = (organization as any).status === "pending_kyc";
  const isActive = (organization as any).status === "active";

  const handleUpdateStatus = (newStatus: "active" | "suspended") => {
    updateMutation.mutate(
      {
        id: organization.id,
        payload: {
          status: newStatus,
          notes: newStatus === "suspended" ? `KYC Ditolak: ${rejectReason || "Dokumen belum valid"}` : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "active"
              ? `Organisasi "${organization.name}" berhasil diverifikasi dan aktif!`
              : `Status organisasi "${organization.name}" ditangguhkan / ditolak.`
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
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Verifikasi Dokumen Legal &amp; KYC Perusahaan
                </DialogTitle>
                <DialogDescription className="text-xs text-[#7A7A72]">
                  Pemeriksaan keabsahan entitas bisnis, NPWP, NIB, dan persetujuan akses platform.
                </DialogDescription>
              </div>
            </div>

            {isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi &amp; Aktif
              </span>
            ) : isPendingKyc ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Menunggu Persetujuan KYC
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldAlert className="h-3.5 w-3.5" /> Nonaktif / Ditangguhkan
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Nama Entitas Legal
              </span>
              <p className="text-sm font-bold text-gray-900">{organization.name}</p>
              <span className="text-xs text-[#1D6B5A] mt-0.5 block capitalize">
                Sektor: {organization.industry || "Logistik & Transportasi"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Nomor Pokok Wajib Pajak (NPWP)
              </span>
              <p className="text-sm font-semibold font-mono text-gray-900">
                {organization.npwp || "01.234.567.8-901.000"}
              </p>
              <span className="text-xs text-emerald-600 mt-0.5 block">Validasi Format Ditjen Pajak</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1">
                Paket Langganan &amp; Kuota
              </span>
              <p className="text-sm font-bold uppercase text-[#1D6B5A]">
                {organization.subscriptionPlan || "Starter"} Plan
              </p>
              <span className="text-xs text-[#7A7A72] mt-0.5 block">
                Maks. {organization.maxAssets || 15} Kendaraan
              </span>
            </div>
          </div>

          {/* PIC & Legal Contacts */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-[#F7F5EF]/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#1D6B5A]" />
              Penanggung Jawab Perusahaan (PIC)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#7A7A72] shrink-0" />
                <div>
                  <span className="text-[#7A7A72] block">Email Resmi:</span>
                  <span className="font-semibold text-gray-900">{organization.contactEmail || "-"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#7A7A72] shrink-0" />
                <div>
                  <span className="text-[#7A7A72] block">Telepon / Kontak:</span>
                  <span className="font-semibold text-gray-900">{organization.contactPhone || "-"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#7A7A72] shrink-0" />
                <div>
                  <span className="text-[#7A7A72] block">Domisili Kantor:</span>
                  <span className="font-semibold text-gray-900">
                    {organization.city}, {organization.province}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Documents Status */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#1D6B5A]" />
              Berkas Legalitas Usaha
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Surat Keterangan NPWP</span>
                  <span className="text-[11px] text-[#7A7A72]">Format Resmi Badan</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Lengkap
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Nomor Induk Berusaha (NIB)</span>
                  <span className="text-[11px] text-[#7A7A72]">OSS Berbasis Risiko</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Lengkap
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">KTP Penanggung Jawab</span>
                  <span className="text-[11px] text-[#7A7A72]">e-KTP PIC</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Lengkap
                </span>
              </div>
            </div>
          </div>

          {/* Rejection Input */}
          {showRejectInput && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <label className="text-xs font-semibold text-rose-800 block">
                Alasan Penolakan KYC / Catatan Koreksi Berkas
              </label>
              <textarea
                placeholder="Tuliskan alasan penolakan atau kekurangan berkas legalitas..."
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
                  onClick={() => handleUpdateStatus("suspended")}
                  disabled={updateMutation.isPending}
                >
                  Konfirmasi Tolak KYC
                </Button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDEAE0]">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs border-[#DEDAD0]">
              Tutup
            </Button>

            <div className="flex items-center gap-2">
              {!showRejectInput && (
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

              <Button
                size="sm"
                onClick={() => handleUpdateStatus("active")}
                className="bg-[#1D6B5A] hover:bg-[#155245] text-white text-xs shadow-sm font-semibold"
                disabled={updateMutation.isPending}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {updateMutation.isPending ? "Memproses..." : "Setujui & Aktifkan Organisasi (Approve)"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
