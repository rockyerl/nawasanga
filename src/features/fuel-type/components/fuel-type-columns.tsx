import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { FuelTypeTableRowActions } from "@/features/fuel-type/components/fuel-type-table-row-actions";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";
import { UNIT_LABEL, UNIT_COLOR } from "@/features/fuel-type/constants/fuel-type.constants";

export const fuelTypeColumns: ColumnDef<FuelTypeTypes.Service.FuelTypeData>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode" />,
        cell: ({ row }) => {
            const code = (row.getValue("code") as string) || (row.original?.id?.replace("ft_", "")?.toUpperCase()) || "BBM";
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium"
                    style={{ background: "#EDEAE0", color: "#4A3728" }}
                >
                    {code}
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Bahan Bakar" />,
        cell: ({ row }) => (
            <span className="text-sm font-medium" style={{ color: "#1A1A18" }}>
                {row.getValue("name") || "—"}
            </span>
        ),
    },
    {
        accessorKey: "unit",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
        cell: ({ row }) => {
            const unit = (row.getValue("unit") as FuelTypeTypes.Service.Unit) || "liter";
            const color = UNIT_COLOR[unit] || { bg: "#eef5f3", text: "#1D6B5A" };
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {UNIT_LABEL[unit] || unit || "Liter"}
                </span>
            );
        },
    },
    {
        accessorKey: "emissionFactor",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Faktor Emisi (kg CO₂)" />,
        cell: ({ row }) => {
            const unit = row.original?.unit || "liter";
            const rawEf = row.getValue("emissionFactor") ?? (row.original as any)?.emissionFactorKgCo2PerLiter ?? 0;
            const ef = Number(rawEf) || 0;
            return (
                <span className="text-sm font-mono" style={{ color: "#1D6B5A" }}>
                    {ef.toFixed(4)}
                    <span className="ml-1 text-[10px]" style={{ color: "#7A7A72" }}>
                        /{UNIT_LABEL[unit] || "L"}
                    </span>
                </span>
            );
        },
    },
    {
        accessorKey: "pricePerUnit",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga (Rp)" />,
        cell: ({ row }) => {
            const rawPrice = row.getValue("pricePerUnit") ?? (row.original as any)?.unitPriceIdr ?? 0;
            const price = Number(rawPrice) || 0;
            return (
                <span className="text-sm font-mono" style={{ color: "#1A1A18" }}>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)}
                </span>
            );
        },
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
        accessorKey: "source",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Referensi" />,
        cell: ({ row }) => (
            <span className="text-sm" style={{ color: "#7A7A72" }}>
                {row.getValue("source") || "IPCC / ESDM"}
            </span>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Diperbarui" />,
        cell: ({ row }) => {
            const rawDate = row.getValue("updatedAt") || (row.original as any)?.updatedAt;
            const date = rawDate ? new Date(rawDate) : new Date();
            const isValid = !isNaN(date.getTime());
            return (
                <span className="text-sm" style={{ color: "#7A7A72" }}>
                    {isValid ? date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <FuelTypeTableRowActions row={row} />,
    },
];