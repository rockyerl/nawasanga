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
import { driverColumns } from "@/features/driver/components/driver-columns";
import { DriverTableToolbar } from "@/features/driver/components/driver-table-toolbar";
import { DriverFormDialog } from "@/features/driver/components/driver-form-dialog";
import { mockDrivers } from "@/lib/mock-data/driver.mock";

export function DriverTable() {
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            mockDrivers.filter(
                (d) =>
                    d.name.toLowerCase().includes(search.toLowerCase()) ||
                    d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
                    d.locationName.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: driverColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <div className="space-y-4">
                <DriverTableToolbar
                    table={table}
                    search={search}
                    setSearch={setSearch}
                    onAdd={() => setOpen(true)}
                />
                <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                    <DataGrid
                        table={table}
                        columnsLength={driverColumns.length}
                        isLoading={false}
                        isError={false}
                    />
                </div>
            </div>

            <DriverFormDialog open={open} setOpen={setOpen} />
        </>
    );
}