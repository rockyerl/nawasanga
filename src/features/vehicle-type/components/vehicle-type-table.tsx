"use client";

import { useReactTable } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
} from "@tanstack/table-core";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { vehicleTypeColumns } from "@/features/vehicle-type/components/vehicle-type-columns";
import { VehicleTypeTableToolbar } from "@/features/vehicle-type/components/vehicle-type-table-toolbar";
import { VehicleTypeFormDialog } from "@/features/vehicle-type/components/vehicle-type-form-dialog";
import { mockVehicleTypes } from "@/lib/mock-data/vehicle-type.mock";

export function VehicleTypeTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() =>
            mockVehicleTypes.filter((row) =>
                row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.category.toLowerCase().includes(search.toLowerCase()) ||
                row.description.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: vehicleTypeColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <VehicleTypeTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={vehicleTypeColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <VehicleTypeFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}