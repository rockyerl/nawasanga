"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OperationalTableRowActions } from "@/features/operational/components/operational-table-row-actions";
import { OperationalTypes } from "@/types/features/operational.type";
import { Truck, Cpu, Zap, Fuel } from "lucide-react";

const STATUS_CONFIG: Record<OperationalTypes.Service.AssetStatus, { color: string; label: string; bg: string }> = {
    "Aktif":       { color: "#15803D", label: "Aktif", bg: "#DCFCE7" },
    "Tidak Aktif": { color: "#C2410C", label: "Tidak Aktif", bg: "#FFEDD5" },
    "Maintenance": { color: "#1D4ED8", label: "Maintenance", bg: "#DBEAFE" },
};

const StatusBadge = ({ status }: { status: OperationalTypes.Service.AssetStatus }) => {
    const cfg = STATUS_CONFIG[status] || { color: "#374151", label: status, bg: "#F3F4F6" };
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
        </span>
    );
};

export const assetColumns: ColumnDef<OperationalTypes.Service.AssetData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aset & Identitas" />,
        cell: ({ row }) => {
            const isEquip = (row.original as any).category === "equipment";
            const serial = (row.original as any).serialNumber || (row.original as any).plateNumber;
            return (
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                            background: isEquip ? "#FEF9C3" : "#EDEAE0",
                            color: isEquip ? "#854D0E" : "#1D6B5A",
                        }}
                    >
                        {isEquip ? <Cpu size={16} /> : <Truck size={16} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#1A1A18] truncate">
                            {(row.original as any).brandModel || row.getValue("name")}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span
                                className="font-mono text-[11px] font-medium px-1.5 py-0.2 rounded"
                                style={{ background: "#F0EDE4", color: "#4A3728" }}
                            >
                                {serial}
                            </span>
                            <span className="text-[10px] text-[#7A7A72]">
                                • {isEquip ? "Alat Berat / Stasioner" : "Armada Bergerak"}
                            </span>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Klasifikasi" />,
        cell: ({ row }) => {
            const val = row.getValue("type") as string;
            return (
                <span className="text-xs font-medium text-[#1A1A18] bg-[#F7F5EF] px-2 py-1 rounded-md border border-[#DEDAD0]/60">
                    {val}
                </span>
            );
        },
    },
    {
        accessorKey: "fuelType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Bakar / Energi" />,
        cell: ({ row }) => {
            const fuel = (row.getValue("fuelType") as string) || "Bio Solar";
            const isElectric = (row.original as any).fuelCategory === "electricity" || fuel.toLowerCase().includes("listrik");
            return (
                <div className="flex items-center gap-1.5">
                    {isElectric ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Zap size={12} className="text-amber-600" />
                            {fuel}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1D6B5A]/10 text-[#1D6B5A]">
                            <Fuel size={12} />
                            {fuel}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "power",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Spesifikasi / Daya" />,
        cell: ({ row }) => (
            <span className="text-xs font-mono text-[#7A7A72]">
                {row.getValue("power") || "—"}
            </span>
        ),
    },
    {
        accessorKey: "location",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pool / Workshop" />,
        cell: ({ row }) => (
            <span className="text-xs text-[#1A1A18] font-medium">
                {row.getValue("location") || "Pool Utama"}
            </span>
        ),
    },
    {
        accessorKey: "fuelConsumption",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Baseline Konsumsi" />,
        cell: ({ row }) => (
            <span className="text-xs font-mono text-[#1D6B5A] font-medium">
                {row.getValue("fuelConsumption") || "—"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
        accessorKey: "notes",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Driver / Keterangan" />,
        cell: ({ row }) => (
            <span className="text-xs text-[#7A7A72] truncate max-w-[150px] block">
                {row.getValue("notes") || "—"}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <OperationalTableRowActions row={row} />,
    },
];
