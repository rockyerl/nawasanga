import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { BillingTableRowActions } from "@/features/billing/components/billing-table-row-actions";
import { BillingTypes } from "@/types/features/billing.type";
import { PLAN_LABEL, PLAN_COLOR } from "@/lib/mock-data/billing.mock";

export const billingColumns: ColumnDef<BillingTypes.Service.BillingData>[] = [
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
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(amount);

            return (
                <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                {formatted}
            </span>
            );
        },
    },
    {
        accessorKey: "paymentDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tgl Bayar" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("paymentDate") as string);
            return (
                <span className="text-sm" style={{ color: "#7A7A72" }}>
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        accessorKey: "subscriptionPlan",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Subs Plan" />,
        cell: ({ row }) => {
            const plan = row.getValue("subscriptionPlan") as BillingTypes.Service.SubscriptionPlan;
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
            const date = new Date(row.getValue("subscriptionExpiresAt") as string);
            const isExpired = date < new Date();
            return (
                <span className="text-sm" style={{ color: isExpired ? "#B91C1C" : "#1A1A18" }}>
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <BillingTableRowActions row={row} />,
    },
];