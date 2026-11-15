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
import { fuelTypeColumns } from "@/features/fuel-type/components/fuel-type-columns";
import { FuelTypeTableToolbar } from "@/features/fuel-type/components/fuel-type-table-toolbar";
import { FuelTypeFormDialog } from "@/features/fuel-type/components/fuel-type-form-dialog";
import { mockFuelTypes } from "@/lib/mock-data/fuel-type.mock";

export function FuelTypeTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() =>
            mockFuelTypes.filter((row) =>
                row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.code.toLowerCase().includes(search.toLowerCase()) ||
                row.source.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: fuelTypeColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <FuelTypeTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={fuelTypeColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <FuelTypeFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}