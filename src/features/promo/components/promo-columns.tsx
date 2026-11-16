import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { PromoTableRowActions } from "./promo-table-row-actions";
import { PromoTypes } from "@/types/features/promo.type";
import { STATUS_COLOR } from "@/features/promo/constants/promo.constants";
import { Bell, BellOff } from "lucide-react";

export const promoColumns: ColumnDef<PromoTypes.Service.PromoData>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Promo" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm font-semibold" style={{ color: "#1A1A18" }}>
                    {row.getValue("title")}
                </span>
                <span className="text-[11px] font-mono text-[#1D6B5A]">
                    Kode: {row.original.code}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "discountValue",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Potongan" />,
        cell: ({ row }) => {
            const type = row.original.discountType;
            const val = row.getValue("discountValue") as number;
            return (
                <span className="text-sm font-medium">
                    {type === "persen" ? `${val}%` : `Rp ${val.toLocaleString("id-ID")}`}
                </span>
            );
        },
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Berlaku Sampai" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("endDate") as string);
            return (
                <span className="text-sm text-[#7A7A72]">
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        accessorKey: "isPushNotified",
        header: () => <span className="text-xs">Push</span>,
        cell: ({ row }) => (
            row.getValue("isPushNotified") ?
                <Bell size={14} className="text-orange-500" /> :
                <BellOff size={14} className="text-gray-300" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as PromoTypes.Service.PromoStatus;
            const color = STATUS_COLOR[status] || { bg: "#eef5f3", text: "#1D6B5A" };
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {status || "ACTIVE"}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const onEdit = (table.options.meta as any)?.onEdit;
            return <PromoTableRowActions row={row} onEdit={onEdit} />;
        },
    },
];