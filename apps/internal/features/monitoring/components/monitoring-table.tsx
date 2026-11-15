"use client";

import { useReactTable } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
} from "@tanstack/table-core";
import { useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { monitoringColumns } from "./monitoring-columns";
import { MonitoringTableToolbar } from "./monitoring-table-toolbar";
import { useMonitorings, useSyncMonitoring } from "../hooks/monitoring-queries";
import { QueryDirection } from "@/types/lib/query.type";

export function MonitoringTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useMonitorings({
        page: pagination.pageIndex + 1,
        itemPerPage: pagination.pageSize,
        search,
        sortBy: sorting[0]?.id || "lastDataSync",
        direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    });

    const { mutate: syncData, isPending: isSyncing } = useSyncMonitoring();

    const table = useReactTable({
        data: (data?.data as any)?.items ?? [],
        columns: monitoringColumns,
        pageCount: (data?.data as any)?.totalPages ?? -1,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    return (
        <div className="space-y-4">
            <MonitoringTableToolbar
                search={search}
                setSearch={setSearch}
                onSync={() => syncData()}
                isSyncing={isSyncing}
            />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={monitoringColumns.length}
                    isLoading={isLoading || isSyncing}
                    isError={isError}
                />
            </div>
        </div>
    );
}