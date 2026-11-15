import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { LogTableRowActions } from "@/features/log/components/log-table-row-actions";
import type { LogTypes } from "@/types/features/log.type";
import { ImageIcon } from "lucide-react";

export const logColumns: ColumnDef<LogTypes.Service.LogData>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Log ID" />,
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("id")}</span>
        ),
    },
    {
        id: "datetime",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal & Jam" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">
        {row.original.date} {row.original.time}
      </span>
        ),
    },
    {
        accessorKey: "driverName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Driver" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 truncate">{row.getValue("driverName")}</span>
                <span className="text-xs text-[#8E8E8E]">{row.original.driverId}</span>
            </div>
        ),
    },
    {
        accessorKey: "vehicleName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kendaraan" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 truncate">{row.getValue("vehicleName")}</span>
                <span className="text-xs text-[#8E8E8E]">{row.original.vehicleId}</span>
            </div>
        ),
    },
    {
        accessorKey: "assetName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aset" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 truncate">{row.getValue("assetName")}</span>
                <span className="text-xs text-[#8E8E8E]">{row.original.assetId}</span>
            </div>
        ),
    },
    {
        accessorKey: "lastOdometer",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Odometer" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">
        {(row.getValue("lastOdometer") as number).toLocaleString("id-ID")} km
      </span>
        ),
    },
    {
        accessorKey: "pictureUrl",
        header: () => <span className="text-xs font-medium text-[#8E8E8E]">Foto</span>,
        cell: ({ row }) => {
            const url = row.getValue("pictureUrl") as string | undefined;
            if (!url) return <span className="text-xs text-neutral-300">—</span>;
            return (
                <div className="flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                    <img
                        src={url}
                        alt="log"
                        className="h-8 w-10 rounded object-cover border border-neutral-200"
                    />
                </div>
            );
        },
        enableSorting: false,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <LogTableRowActions row={row} />,
    },
];