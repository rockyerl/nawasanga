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
import { logColumns } from "@/features/log/components/log-columns";
import { LogTableToolbar } from "@/features/log/components/log-table-toolbar";
import { mockLogs } from "@/lib/mock-data/log.mock";

export function LogTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [filterDriver, setFilterDriver] = useState("");
    const [filterVehicle, setFilterVehicle] = useState("");
    const [filterAsset, setFilterAsset] = useState("");

    const filtered = useMemo(() => {
        return mockLogs.filter((row) => {
            const matchSearch =
                !search ||
                row.id.toLowerCase().includes(search.toLowerCase()) ||
                row.driverName.toLowerCase().includes(search.toLowerCase()) ||
                row.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
                row.assetName.toLowerCase().includes(search.toLowerCase());

            const matchDriver = !filterDriver || row.driverId === filterDriver;
            const matchVehicle = !filterVehicle || row.vehicleId === filterVehicle;
            const matchAsset = !filterAsset || row.assetId === filterAsset;

            return matchSearch && matchDriver && matchVehicle && matchAsset;
        });
    }, [search, filterDriver, filterVehicle, filterAsset]);

    const table = useReactTable({
        data: filtered,
        columns: logColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <LogTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                filterDriver={filterDriver}
                setFilterDriver={setFilterDriver}
                filterVehicle={filterVehicle}
                setFilterVehicle={setFilterVehicle}
                filterAsset={filterAsset}
                setFilterAsset={setFilterAsset}
            />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={logColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
        </div>
    );
}