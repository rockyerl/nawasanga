import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { UserTableRowActions } from "@/features/users/components/users-table-row-actions";
import type { UserData } from "@/types/features/user.type";

export const userColumns: ColumnDef<UserData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("name")}</span>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("email")}</span>
        ),
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="No. Telepon" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("phone")}</span>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => (
            <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("role")}</span>
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
        cell: ({ row }) => <UserTableRowActions row={row} />,
    },
];