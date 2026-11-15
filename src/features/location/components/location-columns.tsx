import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { LocationTableRowActions } from "@/features/location/components/location-table-row-actions";
import type { Location } from "@/types/features/location.type";

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
    Pool:      { bg: "#EFF6FF", text: "#3B82F6" },
    Site:      { bg: "#F0FDF4", text: "#22C55E" },
    Warehouse: { bg: "#FFF7ED", text: "#F97316" },
    Branch:    { bg: "#FAF5FF", text: "#A855F7" },
};

export const locationColumns: ColumnDef<Location>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("name")}</span>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const style = TYPE_STYLES[type] ?? { bg: "#F3F4F6", text: "#6B7280" };
            return (
                <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: style.bg, color: style.text }}
                >
                    {type}
                </span>
            );
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "province",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Provinsi" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("province")}</span>
        ),
    },
    {
        accessorKey: "city",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kota" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("city")}</span>
        ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alamat" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate max-w-[200px] block">{row.getValue("address")}</span>
        ),
    },
    {
        accessorKey: "pic",
        header: ({ column }) => <DataTableColumnHeader column={column} title="PIC" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("pic")}</span>
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
        cell: ({ row }) => <LocationTableRowActions row={row} />,
    },
];