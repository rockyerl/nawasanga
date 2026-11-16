"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { TicketingTableRowActions } from "./ticketing-table-row-actions";
import { TicketingTypes } from "@/types/features/ticketing.type";
import { STATUS_LABEL, STATUS_COLOR } from "@/features/ticketing/constants/ticketing.constants";
import { MessageSquare, AlertCircle } from "lucide-react";

export const ticketingColumns: ColumnDef<TicketingTypes.Service.TicketData>[] = [
    {
        accessorKey: "reportType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis Laporan / Masalah" />,
        cell: ({ row }) => {
            const ticket = row.original;
            return (
                <div className="flex flex-col max-w-[280px]">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                        {ticket.reportType || ticket.subject}
                    </span>
                    <span className="text-xs text-[#7A7A72] line-clamp-1 mt-0.5">
                        {ticket.reportDetail || ticket.description}
                    </span>
                    {ticket.adminNotes && (
                        <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                            <MessageSquare className="h-3 w-3" /> Ada Tanggapan Tim
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "organizationName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Organisasi & Pemohon" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-900 truncate">
                    {row.getValue("organizationName")}
                </span>
                <span className="text-[11px] text-[#7A7A72]">
                    PIC: {row.original.customerName}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "priority",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prioritas" />,
        cell: ({ row }) => {
            const priority = (row.original.priority || "medium").toLowerCase();
            if (priority === "high") {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="h-3 w-3" /> Tinggi
                    </span>
                );
            }
            if (priority === "medium") {
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Sedang
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600">
                    Rendah
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as TicketingTypes.Service.TicketStatus;
            const color = STATUS_COLOR[status] || { bg: "#eef5f3", text: "#1D6B5A" };
            return (
                <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {STATUS_LABEL[status] || status || "Open"}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Pengajuan" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return (
                <span className="text-xs text-[#7A7A72]">
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row, table }) => {
            const onEdit = (table.options.meta as any)?.onEdit;
            return <TicketingTableRowActions row={row} onEdit={onEdit} />;
        },
    },
];
