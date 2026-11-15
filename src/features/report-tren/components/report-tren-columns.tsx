"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ReportTrenTableRowActions } from "@/features/report-tren/components/report-tren-table-row-actions";
import { type PlanType, type TrendTypes } from "@/types/features/report-tren.type";

type TrendSeries = TrendTypes.Service.TrendSeries;

function buildColumns(plan: PlanType): ColumnDef<TrendSeries>[] {
    const cols: ColumnDef<TrendSeries>[] = [
        {
            accessorKey: "label",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Label" />,
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-700">{row.getValue("label")}</span>
            ),
        },
        {
            accessorKey: "color",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Warna" />,
            cell: ({ row }) => {
                const color = row.getValue<string>("color");
                return (
                    <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm text-[#8E8E8E]">{color}</span>
                    </span>
                );
            },
        },
        {
            accessorKey: "data",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Data" />,
            cell: ({ row }) => {
                const data = row.getValue<TrendTypes.Service.TrendPoint[]>("data");
                return <span className="text-sm text-[#8E8E8E]">{data?.length ?? 0} titik</span>;
            },
        },
    ];

    // pro+ tampilkan nilai pertama & terakhir sebagai ringkasan
    if (plan === "pro" || plan === "enterprise") {
        cols.push({
            id: "range",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Rentang Nilai" />,
            cell: ({ row }) => {
                const data = row.original.data;
                if (!data?.length) return <span className="text-sm text-[#8E8E8E]">-</span>;
                const min = Math.min(...data.map((d) => d.value));
                const max = Math.max(...data.map((d) => d.value));
                return (
                    <span className="text-sm text-[#8E8E8E]">
                        {min} – {max}
                    </span>
                );
            },
        });
    }

    cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <ReportTrenTableRowActions row={row} plan={plan} />,
    });

    return cols;
}

export const trendColumns: Record<PlanType, ColumnDef<TrendSeries>[]> = {
    trial:      buildColumns("trial"),
    starter:    buildColumns("starter"),
    pro:        buildColumns("pro"),
    enterprise: buildColumns("enterprise"),
};