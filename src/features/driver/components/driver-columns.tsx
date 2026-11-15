import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DriverTableRowActions } from "@/features/driver/components/driver-table-row-actions";
import type { DriverData } from "@/types/features/driver.type";

export const driverColumns: ColumnDef<DriverData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("name")}</span>
        ),
    },
    {
        accessorKey: "employeeId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID Karyawan" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("employeeId")}</span>
        ),
    },
    {
        accessorKey: "licenseType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis SIM" />,
        cell: ({ row }) => (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                {row.getValue("licenseType")}
            </span>
        ),
    },
    {
        accessorKey: "licenseNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="No. SIM" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("licenseNumber")}</span>
        ),
    },
    {
        accessorKey: "licenseExpiry",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kadaluarsa SIM" />,
        cell: ({ row }) => {
            const expiry = row.getValue("licenseExpiry") as string;
            const isExpiringSoon = new Date(expiry) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            const isExpired = new Date(expiry) < new Date();
            return (
                <span
                    className="text-sm truncate"
                    style={{
                        color: isExpired ? "#ef4444" : isExpiringSoon ? "#f97316" : "#8E8E8E",
                    }}
                >
                    {new Date(expiry).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="No. Telepon" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("phone")}</span>
        ),
    },
    {
        accessorKey: "locationName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lokasi" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("locationName")}</span>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const isActive = status === "Aktif";
            return (
                <span className="inline-flex items-center gap-1.5">
                    <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: isActive ? "#22c55e" : "#f97316" }}
                    />
                    <span className="text-sm" style={{ color: isActive ? "#22c55e" : "#f97316" }}>
                        {status}
                    </span>
                </span>
            );
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <DriverTableRowActions row={row} />,
    },
];