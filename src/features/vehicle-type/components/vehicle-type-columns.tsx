import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { VehicleTypeTableRowActions } from "@/features/vehicle-type/components/vehicle-type-table-row-actions";
import { VehicleTypeTypes } from "@/types/features/vehicle-type.type";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/mock-data/vehicle-type.mock";

export const vehicleTypeColumns: ColumnDef<VehicleTypeTypes.Service.VehicleTypeData>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
        cell: ({ row }) => {
            const cat = row.getValue("category") as VehicleTypeTypes.Service.Category;
            const color = CATEGORY_COLOR[cat];
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
          {CATEGORY_LABEL[cat]}
        </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Tipe" />,
        cell: ({ row }) => (
            <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
        {row.getValue("name")}
      </span>
        ),
    },
    {
        accessorKey: "defaultFuelTypeId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Bakar Default" />,
        cell: ({ row }) => {
            const id = row.getValue("defaultFuelTypeId") as string | null;
            if (!id) return <span style={{ color: "#7A7A72" }}>—</span>;
            // Map fuel type ID to label
            const map: Record<string, string> = {
                ft_pertalite: "Pertalite",
                ft_pertamax:  "Pertamax",
                ft_solar:     "Solar",
                ft_lpg:       "LPG",
                ft_listrik:   "Listrik",
            };
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
                    style={{ background: "#EDEAE0", color: "#4A3728" }}
                >
          {map[id] ?? id}
        </span>
            );
        },
    },
    {
        accessorKey: "consumptionKm",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Emisi (kg CO₂/km)" />,
        cell: ({ row }) => (
            <span className="text-sm font-mono" style={{ color: "#1D6B5A" }}>
        {(row.getValue("consumptionKm") as number).toFixed(4)}
      </span>
        ),
    },
    {
        accessorKey: "gvwMinTon",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Min. GVW (ton)" />,
        cell: ({ row }) => {
            const val = row.getValue("gvwMinTon") as number | null;
            return (
                <span className="text-sm" style={{ color: val ? "#1A1A18" : "#7A7A72" }}>
          {val != null ? `${val.toFixed(2)} ton` : "—"}
        </span>
            );
        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
        cell: ({ row }) => (
            <span
                className="text-sm max-w-[240px] truncate block"
                style={{ color: "#7A7A72" }}
                title={row.getValue("description")}
            >
        {row.getValue("description") || "—"}
      </span>
        ),
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <VehicleTypeTableRowActions row={row} />,
    },
];