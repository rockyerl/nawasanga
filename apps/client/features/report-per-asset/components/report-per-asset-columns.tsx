import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { PerAssetTableRowActions } from "@/features/report-per-asset/components/report-per-asset-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import type { AssetData, PlanType } from "@/lib/mock-data/report-per-asset.mock";

const STATUS_COLOR: Record<string, string> = {
    "Baik":             "#22c55e",
    "Perlu Perhatian":  "#EAB308",
    "Kritis":           "#ef4444",
};

function buildColumns(plan: PlanType): ColumnDef<AssetData>[] {
    const cols: ColumnDef<AssetData>[] = [
        {
            accessorKey: "rank",
            header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E]">{row.getValue("rank")}</span>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Asset" />,
            cell: ({ row }) => <span className="text-sm font-medium text-gray-800">{row.getValue("name")}</span>,
        },
    ];

    // enterprise: tambah lokasi
    if (plan === "enterprise") {
        cols.push({
            accessorKey: "location",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Lokasi" />,
            cell: ({ row }) => <span className="text-sm text-[#8E8E8E]">{row.getValue("location")}</span>,
        });
    }

    cols.push(
        {
            accessorKey: "totalEmissions",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Emisi (ton CO₂e)" />,
            cell: ({ row }) => (
                <span className="text-sm text-[#8E8E8E]">
                    {(row.getValue("totalEmissions") as number).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "totalFuel",
            header: ({ column }) => <DataTableColumnHeader column={column} title="BBM (L)" />,
            cell: ({ row }) => (
                <span className="text-sm text-[#8E8E8E]">
                    {(row.getValue("totalFuel") as number).toLocaleString()}
                </span>
            ),
        },
    );

    // pro+: tambah efisiensi & status
    if (plan === "pro" || plan === "enterprise") {
        cols.push(
            {
                accessorKey: "efficiency",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Efisiensi (km/L)" />,
                cell: ({ row }) => (
                    <span className="text-sm text-[#8E8E8E]">{row.getValue("efficiency")}</span>
                ),
            },
            {
                accessorKey: "status",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                cell: ({ row }) => {
                    const s = row.getValue("status") as string;
                    return (
                        <span
                            className="inline-flex items-center gap-1.5 text-sm font-medium"
                            style={{ color: STATUS_COLOR[s] ?? "#8E8E8E" }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: STATUS_COLOR[s] ?? "#8E8E8E" }}
                            />
                            {s}
                        </span>
                    );
                },
            },
        );
    }

    // starter+: tambah % dari total emisi
    if (plan !== "trial") {
        cols.push({
            accessorKey: "percentage",
            header: ({ column }) => <DataTableColumnHeader column={column} title="% Total Emisi" />,
            cell: ({ row }) => {
                const pct = row.getValue("percentage") as number;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#1D9E75]"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-xs text-[#8E8E8E]">{pct}%</span>
                    </div>
                );
            },
        });
    }

    cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <PerAssetTableRowActions row={row} plan={plan} />,
    });

    return cols;
}

export const assetColumns: Record<PlanType, ColumnDef<AssetData>[]> = {
    trial:      buildColumns("trial"),
    starter:    buildColumns("starter"),
    pro:        buildColumns("pro"),
    enterprise: buildColumns("enterprise"),
};