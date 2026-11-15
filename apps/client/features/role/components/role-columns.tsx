import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RoleTableRowActions } from "@/features/role/components/role-table-row-actions";
import type { RoleData } from "@/types/features/role.type";

export const roleColumns: ColumnDef<RoleData>[] = [
    {
        accessorKey: "roleName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Role" />,
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("roleName")}</span>
        ),
    },
    {
        accessorKey: "permissions",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Permission" />,
        cell: ({ row }) => {
            const permissions = row.getValue("permissions") as string[];
            return (
                <div className="flex flex-wrap gap-1">
                    {permissions.map((p) => (
                        <span
                            key={p}
                            className="inline-flex items-center rounded-md bg-[#29A2A5]/10 px-2 py-0.5 text-xs font-medium text-[#29A2A5]"
                        >
                            {p}
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <RoleTableRowActions row={row} />,
    },
];