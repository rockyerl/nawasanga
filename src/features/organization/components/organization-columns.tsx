import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OrganizationTableRowActions } from "@/features/organization/components/organization-table-row-actions";
import { OrganizationTypes } from "@/types/features/organization.type";
import {
    INDUSTRY_LABEL,
    INDUSTRY_COLOR,
    PLAN_LABEL,
    PLAN_COLOR,
} from "@/lib/mock-data/organization.mock";

export const organizationColumns: ColumnDef<OrganizationTypes.Service.OrganizationData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Organisasi" />,
        cell: ({ row }) => (
            <div>
                <p className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                    {row.getValue("name")}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "#7A7A72" }}>
                    {row.original.city}, {row.original.province}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "industry",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Industri" />,
        cell: ({ row }) => {
            const ind = row.getValue("industry") as OrganizationTypes.Service.Industry;
            const color = INDUSTRY_COLOR[ind];
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {INDUSTRY_LABEL[ind]}
                </span>
            );
        },
    },
    {
        accessorKey: "npwp",
        header: ({ column }) => <DataTableColumnHeader column={column} title="NPWP" />,
        cell: ({ row }) => {
            const npwp = row.getValue("npwp") as string | null;
            return (
                <span className="text-sm font-mono" style={{ color: npwp ? "#1A1A18" : "#7A7A72" }}>
                    {npwp ?? "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "subscriptionPlan",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
        cell: ({ row }) => {
            const plan = row.getValue("subscriptionPlan") as OrganizationTypes.Service.SubscriptionPlan;
            const color = PLAN_COLOR[plan];
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {PLAN_LABEL[plan]}
                </span>
            );
        },
    },
    {
        accessorKey: "subscriptionExpiresAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expired" />,
        cell: ({ row }) => {
            const val = row.getValue("subscriptionExpiresAt") as string | null;
            if (!val) return <span style={{ color: "#7A7A72" }}>—</span>;
            const date = new Date(val);
            const isExpired = date < new Date();
            return (
                <span
                    className="text-sm"
                    style={{ color: isExpired ? "#B91C1C" : "#1A1A18" }}
                >
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        accessorKey: "maxAssets",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Maks. Aset" />,
        cell: ({ row }) => (
            <span className="text-sm font-mono" style={{ color: "#1A1A18" }}>
                {(row.getValue("maxAssets") as number).toLocaleString("id-ID")}
            </span>
        ),
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const active = row.getValue("isActive") as boolean;
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={
                        active
                            ? { background: "#DCFCE7", color: "#15803D" }
                            : { background: "#FEE2E2", color: "#B91C1C" }
                    }
                >
                    {active ? "Aktif" : "Nonaktif"}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return (
                <span className="text-sm" style={{ color: "#7A7A72" }}>
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <OrganizationTableRowActions row={row} />,
    },
];