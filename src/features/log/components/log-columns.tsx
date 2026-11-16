import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { LogTableRowActions } from "@/features/log/components/log-table-row-actions";
import type { LogTypes } from "@/types/features/log.type";
import { Fuel, CloudRain, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const logColumns: ColumnDef<LogTypes.Service.LogData>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Log ID" />,
        cell: ({ row }) => (
            <span className="text-xs text-gray-700 font-mono font-medium truncate">
                {row.getValue("id")}
            </span>
        ),
    },
    {
        id: "datetime",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal & Jam" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-800">{row.original.date}</span>
                <span className="text-[11px] text-[#7A7A72]">{row.original.time} WIB</span>
            </div>
        ),
    },
    {
        accessorKey: "vehicleName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kendaraan" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-900 truncate">{row.getValue("vehicleName")}</span>
                <span className="text-[11px] text-[#7A7A72] truncate">{row.original.assetName}</span>
            </div>
        ),
    },
    {
        accessorKey: "driverName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Driver / Operator" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800 truncate">{row.getValue("driverName")}</span>
                <span className="text-[11px] text-[#7A7A72] truncate">{row.original.fuelStation || "SPBU Terdaftar"}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 font-semibold mt-0.5">
                    <Sparkles size={9} className="text-[#1D6B5A]" /> AI OCR &amp; Geofence OK
                </span>
            </div>
        ),
    },
    {
        accessorKey: "liters",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Volume BBM" />,
        cell: ({ row }) => {
            const liters = row.original.liters ?? 0;
            return (
                <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-[#1D6B5A]" />
                    <span className="text-xs font-bold text-gray-900">
                        {liters.toLocaleString("id-ID")} <span className="font-normal text-[11px] text-[#7A7A72]">L</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-[#1D6B5A]/20 bg-[#1D6B5A]/5 text-[#1D6B5A]">
                        {row.original.fuelTypeName || "BBM"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "costIdr",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Biaya BBM" />,
        cell: ({ row }) => {
            const cost = row.original.costIdr ?? 0;
            return (
                <span className="text-xs font-semibold text-gray-900">
                    Rp {cost.toLocaleString("id-ID")}
                </span>
            );
        },
    },
    {
        accessorKey: "emissionCo2Kg",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Emisi Karbon" />,
        cell: ({ row }) => {
            const emission = row.original.emissionCo2Kg ?? 0;
            return (
                <div className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-[#1D6B5A]" />
                    <span className="text-xs font-bold text-[#1D6B5A]">
                        {emission.toLocaleString("id-ID")} <span className="font-normal text-[11px] text-gray-500">kg CO₂e</span>
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "lastOdometer",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Odometer" />,
        cell: ({ row }) => {
            const odo = row.original.lastOdometer ?? row.original.odometerKm ?? 0;
            return (
                <span className="text-xs text-[#7A7A72] font-mono">
                    {odo.toLocaleString("id-ID")} km
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <LogTableRowActions row={row} />,
    },
];
