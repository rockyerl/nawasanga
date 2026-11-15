"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ReportAuditTableRowActions } from "@/features/report-audit/components/report-audit-table-row-actions";
import { type PlanType, type AuditTypes } from "@/types/features/report-audit.type";

type InsightItem = AuditTypes.Service.InsightItem;

const TYPE_LABEL: Record<AuditTypes.Service.InsightType, string> = {
    anomaly:        "Anomaly",
    efficiency:     "Efisiensi",
    recommendation: "Rekomendasi",
};

const TYPE_COLOR: Record<AuditTypes.Service.InsightType, string> = {
    anomaly:        "#EF4444",
    efficiency:     "#1D9E75",
    recommendation: "#EF9F27",
};

function buildColumns(plan: PlanType): ColumnDef<InsightItem>[] {
    const cols: ColumnDef<InsightItem>[] = [
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
            cell: ({ row }) => {
                const type = row.getValue<AuditTypes.Service.InsightType>("type");
                return (
                    <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: TYPE_COLOR[type] }}
                    >
                        {TYPE_LABEL[type]}
                    </span>
                );
            },
        },
        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Judul" />,
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-700">{row.getValue("title")}</span>
            ),
        },
        {
            accessorKey: "description",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
            cell: ({ row }) => (
                <span className="text-sm text-[#8E8E8E] line-clamp-2">{row.getValue("description")}</span>
            ),
        },
    ];

    // aksi detail audit hanya untuk enterprise
    if (plan === "enterprise") {
        cols.push({
            accessorKey: "actionLabel",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Aksi" />,
            cell: ({ row }) => {
                const label = row.getValue<string | undefined>("actionLabel");
                if (!label) return <span className="text-sm text-[#8E8E8E]">-</span>;
                return (
                    <span className="text-xs font-medium text-[#1D9E75] underline cursor-pointer">
                        {label}
                    </span>
                );
            },
        });
    }

    cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <ReportAuditTableRowActions row={row} plan={plan} />,
    });

    return cols;
}

export const auditColumns: Record<PlanType, ColumnDef<InsightItem>[]> = {
    trial:      buildColumns("trial"),
    starter:    buildColumns("starter"),
    pro:        buildColumns("pro"),
    enterprise: buildColumns("enterprise"),
};