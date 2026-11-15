import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { MonitoringTypes } from "@/types/features/monitoring.type";

export const monitoringColumns: ColumnDef<MonitoringTypes.Service.MonitoringData>[] = [
    {
        accessorKey: "organizationName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama PT" />,
        cell: ({ row }) => (
            <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                {row.getValue("organizationName")}
            </span>
        ),
    },
    {
        accessorKey: "totalAssets",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Aset" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAssets"));
            return (
                <span className="text-sm" style={{ color: "#1A1A18" }}>
                    {new Intl.NumberFormat("id-ID").format(amount)}
                </span>
            );
        },
    },
    {
        accessorKey: "totalUsers",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total User" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue("totalUsers")}</span>,
    },
    {
        accessorKey: "totalEmissionLogs",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Log Transaksi" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue("totalEmissionLogs")}</span>,
    },
    {
        accessorKey: "lastLogin",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("lastLogin") as string);
            return (
                <span className="text-sm text-[#7A7A72]">
                    {date.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
            );
        },
    },
    {
        accessorKey: "lastDataSync",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Sync" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("lastDataSync") as string);
            return (
                <span className="text-sm font-medium text-[#1D6B5A]">
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
];