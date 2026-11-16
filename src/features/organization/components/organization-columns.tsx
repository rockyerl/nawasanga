import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OrganizationTableRowActions } from "@/features/organization/components/organization-table-row-actions";
import { OrganizationTypes } from "@/types/features/organization.type";
import {
    INDUSTRY_LABEL,
    INDUSTRY_COLOR,
    PLAN_LABEL,
    PLAN_COLOR,
} from "@/features/organization/constants/organization.constants";

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
            const rawInd = (row.getValue("industry") as string) || "logistics";
            const indLower = rawInd.toLowerCase();
            const color = INDUSTRY_COLOR[indLower] || INDUSTRY_COLOR[rawInd] || { bg: "#eef5f3", text: "#1D6B5A" };
            const label = INDUSTRY_LABEL[indLower] || INDUSTRY_LABEL[rawInd] || rawInd;
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {label}
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
            const rawPlan = (row.getValue("subscriptionPlan") as string) || (row.original as any)?.plan || "starter";
            const planLower = rawPlan.toLowerCase();
            const color = PLAN_COLOR[planLower] || PLAN_COLOR[rawPlan] || { bg: "#EFF6FF", text: "#1D4ED8" };
            const label = PLAN_LABEL[planLower] || PLAN_LABEL[rawPlan] || rawPlan;
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {label}
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
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Akun &amp; KYC" />,
        cell: ({ row }) => {
            const status = (row.original as any).status || (row.getValue("isActive") ? "active" : "suspended");
            if (status === "pending_kyc") {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Review KYC
                    </span>
                );
            }
            if (status === "active") {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Aktif
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    Ditangguhkan
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