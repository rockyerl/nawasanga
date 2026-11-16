"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AssetTableRowActions } from "@/features/asset/components/asset-table-row-actions";
import { AssetTypes } from "@/types/features/asset.type";
import { Truck, Cpu, Zap, Fuel } from "lucide-react";

const STATUS_CONFIG: Record<AssetTypes.Service.AssetStatus, { color: string; label: string; bg: string }> = {
    "Aktif":       { color: "#15803D", label: "Aktif", bg: "#DCFCE7" },
    "Tidak Aktif": { color: "#C2410C", label: "Tidak Aktif", bg: "#FFEDD5" },
    "Maintenance": { color: "#1D4ED8", label: "Maintenance", bg: "#DBEAFE" },
};

const StatusBadge = ({ status }: { status: AssetTypes.Service.AssetStatus }) => {
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

export const assetColumns: ColumnDef<AssetTypes.Service.AssetData>[] = [
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
                <span className="text-xs text-[#1A1A18] font-medium">
                    {val || "Kendaraan Operasional"}
                </span>
            );
        },
    },
    {
        accessorKey: "fuelType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Bakar" />,
        cell: ({ row }) => {
            const val = (row.getValue("fuelType") as string) || "Bio Solar B35";
            const isElectric = val.toLowerCase().includes("listrik") || val.toLowerCase().includes("electric");
            return (
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
                    style={{
                        background: isElectric ? "#FEF3C7" : "#F7F5EF",
                        color: isElectric ? "#B45309" : "#1A1A18",
                    }}
                >
                    {isElectric ? <Zap size={12} className="text-amber-600" /> : <Fuel size={12} className="text-[#1D6B5A]" />}
                    {val}
                </span>
            );
        },
    },
    {
        accessorKey: "location",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lokasi Pool" />,
        cell: ({ row }) => (
            <span className="text-xs text-[#7A7A72]">
                {row.getValue("location") || "Pool Utama"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <AssetTableRowActions row={row} />,
    },
];
