import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SubscriptionTableRowActions } from "@/features/subscription/components/subscription-table-row-actions";
import { SubscriptionTypes } from "@/types/features/subscription.type";
import { PLAN_COLOR } from "@/lib/mock-data/subscription.mock";
import { Check, X } from "lucide-react";

const formatPrice = (price: number) =>
    price === 0 ? "Gratis" : `Rp ${price.toLocaleString("id-ID")}`;

export const subscriptionColumns: ColumnDef<SubscriptionTypes.Service.PlanData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
        cell: ({ row }) => {
            const key = row.original.key;
            const color = PLAN_COLOR[key];
            return (
                <div>
                    <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                    >
                        {row.getValue("name")}
                    </span>
                    <p className="text-[11px] mt-1" style={{ color: "#7A7A72" }}>
                        {row.original.description}
                    </p>
                </div>
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
        accessorKey: "maxUsers",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Maks. User" />,
        cell: ({ row }) => (
            <span className="text-sm font-mono" style={{ color: "#1A1A18" }}>
                {(row.getValue("maxUsers") as number).toLocaleString("id-ID")}
            </span>
        ),
    },
    {
        accessorKey: "priceMonthly",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Bulanan" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#1A1A18" }}>
                {formatPrice(row.getValue("priceMonthly") as number)}
            </span>
        ),
    },
    {
        accessorKey: "priceYearly",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Tahunan" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#1A1A18" }}>
                {formatPrice(row.getValue("priceYearly") as number)}
            </span>
        ),
    },
    {
        accessorKey: "features",
        header: () => <span className="text-xs font-medium" style={{ color: "#7A7A72" }}>Fitur Aktif</span>,
        cell: ({ row }) => {
            const features = row.getValue("features") as SubscriptionTypes.Service.PlanFeature[];
            const activeCount = features.filter((f) => f.enabled).length;
            return (
                <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {features.map((feat) => (
                        <span
                            key={feat.key}
                            className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                            style={
                                feat.enabled
                                    ? { background: "#eef5f3", color: "#1D6B5A" }
                                    : { background: "#F3F4F6", color: "#9CA3AF" }
                            }
                        >
                            {feat.enabled
                                ? <Check size={9} />
                                : <X size={9} />
                            }
                            {feat.label}
                        </span>
                    ))}
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const active = row.getValue("isActive") as boolean;
            return (
                <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={
                        active
                            ? { background: "#DCFCE7", color: "#15803D" }
                            : { background: "#F3F4F6", color: "#6B7280" }
                    }
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: active ? "#22c55e" : "#9CA3AF" }}
                    />
                    {active ? "Aktif" : "Nonaktif"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <SubscriptionTableRowActions row={row} />,
    },
];