"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TicketingTypes } from "@/types/features/ticketing.type";
import { STATUS_LABEL, STATUS_COLOR } from "@/features/ticketing/constants/ticketing.constants";
import { HelpCircle, Building2, User, Clock, AlertCircle, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";

interface TicketDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ticket: TicketingTypes.Service.TicketData | null;
  onEditStatus?: (ticket: TicketingTypes.Service.TicketData) => void;
}

export function TicketDetailDialog({ open, setOpen, ticket, onEditStatus }: TicketDetailDialogProps) {
  if (!ticket) return null;

  const statusColor = STATUS_COLOR[ticket.status] || { bg: "#eef5f3", text: "#1D6B5A" };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
        <DialogHeader className="pb-3 border-b border-[#EDEAE0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-[#1D6B5A]/10 flex items-center justify-center text-[#1D6B5A]">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Rincian Tiket Bantuan & Dukungan Teknis
                </DialogTitle>
                <DialogDescription className="text-xs text-[#7A7A72]">
                  Nomor Tiket: #{ticket.id.toUpperCase()} • Diajukan pada {new Date(ticket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </DialogDescription>
              </div>
            </div>

            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
            >
              {STATUS_LABEL[ticket.status] || ticket.status}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-[#1D6B5A]" /> Organisasi
              </span>
              <p className="text-xs font-bold text-gray-900">{ticket.organizationName}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#1D6B5A]" /> Penanggung Jawab (PIC)
              </span>
              <p className="text-xs font-bold text-gray-900">{ticket.customerName}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EDEAE0] bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A72] block mb-1 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Prioritas
              </span>
              <p className="text-xs font-bold capitalize text-amber-700">
                {ticket.priority === "high" ? "Tinggi (Kritis)" : ticket.priority === "medium" ? "Sedang" : "Rendah"}
              </p>
            </div>
          </div>

          {/* Ticket Subject & Detail */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-[#F7F5EF]/60 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              {ticket.reportType || ticket.subject}
            </h4>
            <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
              {ticket.reportDetail || ticket.description}
            </p>
          </div>

          {/* Admin Resolution Notes */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D6B5A] flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Tanggapan & Catatan Penanganan Tim Sundawa
            </h4>
            {ticket.adminNotes ? (
              <p className="text-xs text-gray-800 bg-[#F7F5EF] p-3 rounded-lg border border-[#EDEAE0] leading-relaxed">
                {ticket.adminNotes}
              </p>
            ) : (
              <p className="text-xs text-[#7A7A72] italic bg-[#F7F5EF]/40 p-3 rounded-lg border border-dashed border-[#EDEAE0]">
                Belum ada tanggapan internal dari tim operasional. Tiket sedang dalam antrean pemrosesan.
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDEAE0]">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs border-[#DEDAD0]">
              Tutup
            </Button>

            {onEditStatus && (
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onEditStatus(ticket);
                }}
                className="bg-[#1D6B5A] hover:bg-[#155245] text-white text-xs"
              >
                Ubah Status / Beri Tanggapan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
