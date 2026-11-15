import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RoleTypes } from "@/types/features/role.type";
import { RoleTableRowActions } from "./role-table-row-actions";

export const roleColumns: ColumnDef<RoleTypes.Service.RoleData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Role" />,
        cell: ({ row }) => (
            <span style={{ fontWeight: 600, color: "#1A1A18", fontSize: "13px" }}>
                {row.getValue("name")}
            </span>
        ),
    },
    {
        accessorKey: "permissions",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Akses Menu" />,
        cell: ({ row }) => {
            const permissions = row.original.permissions || [];
            const enabledMenus = permissions.filter((p) => p.enabled);

            return (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "400px" }}>
                    {enabledMenus.length > 0 ? (
                        enabledMenus.map((p) => (
                            <span
                                key={p.url}
                                style={{
                                    padding: "2px 8px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    backgroundColor: "#eef5f3",
                                    color: "#175749",
                                    borderRadius: "9999px",
                                    border: "1px solid #d0e7e2",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {p.title}
                            </span>
                        ))
                    ) : (
                        <span style={{ fontSize: "12px", color: "#7A7A72", fontStyle: "italic" }}>
                            Tidak ada akses
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "userCount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Pengguna" />,
        cell: ({ row }) => (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#F7F5EF",
                    border: "1px solid #DEDAD0",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#1A1A18",
                    fontWeight: 500,
                }}
            >
                {row.getValue("userCount")} User
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <RoleTableRowActions row={row} />,
    },
];