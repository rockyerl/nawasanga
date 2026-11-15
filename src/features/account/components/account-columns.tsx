import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AccountTableRowActions } from "@/features/account/components/account-table-row-actions";
import { AccountTypes } from "@/types/features/account.type";
import { PLAN_LABEL, PLAN_COLOR, STATUS_LABEL, STATUS_COLOR } from "@/lib/mock-data/account.mock";

export const accountColumns: ColumnDef<AccountTypes.Service.AccountData>[] = [
    {
        accessorKey: "companyName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Perusahaan" />,
        cell: ({ row }) => (
            <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                {row.getValue("companyName")}
            </span>
        ),
    },
    {
        accessorKey: "picName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Penanggung Jawab" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#1A1A18" }}>
                {row.getValue("picName")}
            </span>
        ),
    },
    {
        accessorKey: "position",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#7A7A72" }}>
                {row.getValue("position")}
            </span>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#7A7A72" }}>
                {row.getValue("email")}
            </span>
        ),
    },
    {
        accessorKey: "lastActivityAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Activity" />,
        cell: ({ row }) => {
            const val = row.getValue("lastActivityAt") as string | null;
            if (!val) return <span style={{ color: "#7A7A72" }}>—</span>;
            const date = new Date(val);
            return (
                <div>
                    <p className="text-sm" style={{ color: "#1A1A18" }}>
                        {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#7A7A72" }}>
                        {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <AccountTableRowActions row={row} />,
    },
];