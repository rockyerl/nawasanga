import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { UsersTableRowActions } from "@/features/users/components/users-table-row-actions";
import type { UserData } from "@/lib/mock-data/users.mock";

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    "Super Admin": { bg: "#eef5f3", text: "#175749", border: "#d0e7e2" },
    "Admin":       { bg: "#eef5f3", text: "#1D6B5A", border: "#d0e7e2" },
    "Operator":    { bg: "#F7F5EF", text: "#4A3728", border: "#DEDAD0" },
    "Viewer":      { bg: "#F7F5EF", text: "#7A7A72", border: "#EDEAE0" },
    "Finance":     { bg: "#fdf8ee", text: "#7a5c1e", border: "#f0dfa0" },
};

export const userColumns: ColumnDef<UserData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A18" }}>
                    {row.getValue("name")}
                </span>
                {row.original.memberId && (
                    <span style={{ fontSize: "11px", color: "#7A7A72" }}>
                        {row.original.memberId}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
            <span style={{ fontSize: "13px", color: "#7A7A72" }}>
                {row.getValue("email")}
            </span>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const colors = roleColors[role] ?? { bg: "#F7F5EF", text: "#4A3728", border: "#EDEAE0" };
            return (
                <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "9999px",
                    whiteSpace: "nowrap",
                }}>
                    {role}
                </span>
            );
        },
    },
    {
        accessorKey: "lastLoginAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Login Terakhir" />,
        cell: ({ row }) => {
            const val = row.getValue("lastLoginAt") as string | null;
            if (!val) return (
                <span style={{ fontSize: "12px", color: "#DEDAD0", fontStyle: "italic" }}>
                    Belum pernah
                </span>
            );
            const date = new Date(val);
            return (
                <span style={{ fontSize: "12px", color: "#7A7A72" }}>
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <UsersTableRowActions row={row} />,
    },
];