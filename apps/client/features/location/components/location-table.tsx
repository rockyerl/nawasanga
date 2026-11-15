"use client";

import { useReactTable } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
} from "@tanstack/table-core";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { locationColumns } from "@/features/location/components/location-columns";
import { LocationTableToolbar } from "@/features/location/components/location-table-toolbar";
import { LocationFormDialog } from "@/features/location/components/location-form-dialog";
import { mockLocations } from "@/lib/mock-data/location.mock";

export function LocationTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(
        () =>
            mockLocations.filter(
                (row) =>
                    row.name.toLowerCase().includes(search.toLowerCase()) ||
                    row.city.toLowerCase().includes(search.toLowerCase()) ||
                    row.province.toLowerCase().includes(search.toLowerCase()),
            ),
        [search],
    );

    const table = useReactTable({
        data: filtered,
        columns: locationColumns,
        state: { pagination, sorting, columnFilters },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <LocationTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAdd={() => setOpen(true)}
            />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={locationColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <LocationFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}