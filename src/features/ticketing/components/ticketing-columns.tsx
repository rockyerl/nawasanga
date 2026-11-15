import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { TicketingTableRowActions } from "./ticketing-table-row-actions";
import { TicketingTypes } from "@/types/features/ticketing.type";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/mock-data/ticketing.mock";
import { Paperclip } from "lucide-react";

export const ticketingColumns: ColumnDef<TicketingTypes.Service.TicketData>[] = [
    {
        accessorKey: "organizationName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Organisasi" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                    {row.getValue("organizationName")}
                </span>
                <span className="text-[11px]" style={{ color: "#7A7A72" }}>
                    Cust: {row.original.customerName}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "reportType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis Laporan" />,
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("reportType")}</span>,
    },
    {
        accessorKey: "attachmentUrl",
        header: () => <span className="text-xs">Lampiran</span>,
        cell: ({ row }) => (
            row.getValue("attachmentUrl") ? (
                <Paperclip size={14} className="text-[#1D6B5A]" />
            ) : (
                <span className="text-xs text-[#DEDAD0]">-</span>
            )
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as TicketingTypes.Service.TicketStatus;
            const color = STATUS_COLOR[status];
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {STATUS_LABEL[status]}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return (
                <span className="text-sm text-[#7A7A72]">
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
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