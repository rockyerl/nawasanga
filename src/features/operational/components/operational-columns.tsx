"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OperationalTableRowActions } from "@/features/operational/components/operational-table-row-actions";
import { OperationalTypes } from "@/types/features/operational.type";

const STATUS_CONFIG: Record<OperationalTypes.Service.AssetStatus, { color: string; label: string }> = {
    "Aktif":       { color: "#22c55e", label: "Aktif" },
    "Tidak Aktif": { color: "#f97316", label: "Tidak Aktif" },
    "Maintenance": { color: "#3b82f6", label: "Maintenance" },
};

const StatusDot = ({ status }: { status: OperationalTypes.Service.AssetStatus }) => {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
            <span className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
        </span>
    );
};

export const assetColumns: ColumnDef<OperationalTypes.Service.AssetData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => <span className="text-sm font-medium text-gray-700">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
    },
    {
        accessorKey: "fuelType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis BBM" />,
    },
    {
        accessorKey: "serialNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="No. Seri" />,
    },
    {
        accessorKey: "power",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Daya (KW)" />,
    },
    {
        accessorKey: "location",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lokasi" />,
    },
    {
        accessorKey: "fuelConsumption",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Konsumsi BBM (L/Jam)" />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusDot status={row.getValue("status")} />,
    },
    {
        accessorKey: "notes",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Catatan" />,
        cell: ({ row }) => <span className="text-sm text-gray-500 truncate max-w-[150px] block">{row.getValue("notes") || "-"}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => <OperationalTableRowActions row={row} />,
    },
];