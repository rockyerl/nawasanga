import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ReportTableRowActions } from "@/features/report-summary/components/report-summary-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import type { ReportData, PlanType } from "@/types/features/report-summary.type";

function buildColumns(plan: PlanType): ColumnDef<ReportData>[] {
    const cols: ColumnDef<ReportData>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Report ID" />,
            cell: ({ row }) => <span className="text-sm text-gray-700 font-medium truncate">{row.getValue("id")}</span>,
        },
        {
            accessorKey: "period",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Period" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("period")}</span>,
        },
        {
            accessorKey: "totalFuel",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total BBM (L)" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{(row.getValue("totalFuel") as number).toLocaleString()} L</span>,
        },
        {
            accessorKey: "totalEmissions",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total Emisi" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{(row.getValue("totalEmissions") as number).toLocaleString()} kg</span>,
        },
    ];

    // starter+ tambah kendaraan & pengemudi
    if (plan !== "trial") {
        cols.push(
            {
                accessorKey: "totalVehicles",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Kendaraan" />,
                cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("totalVehicles")}</span>,
            },
            {
                accessorKey: "totalDrivers",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Pengemudi" />,
                cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("totalDrivers")}</span>,
            },
        );
    }

    // pro+ tambah avg emisi
    if (plan === "pro" || plan === "enterprise") {
        cols.push({
            accessorKey: "avgEmissions",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Avg Emisi" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E] truncate">{row.getValue("avgEmissions")} kg CO₂/L</span>,
        });
    }

    cols.push(
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${status === "Published" ? "text-green-500" : "text-yellow-500"}`}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status === "Published" ? "#22c55e" : "#EAB308" }} />
                        {status}
          </span>
                );
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => <ReportTableRowActions row={row} plan={plan} />,
        },
    );

    return cols;
}

export const reportColumns: Record<PlanType, ColumnDef<ReportData>[]> = {
    trial:      buildColumns("trial"),
    starter:    buildColumns("starter"),
    pro:        buildColumns("pro"),
    enterprise: buildColumns("enterprise"),
};