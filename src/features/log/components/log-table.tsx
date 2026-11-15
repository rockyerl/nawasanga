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
import { useLogs } from "@/features/log/hooks/use-log-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { LogTypes } from "@/types/features/log.type";

export function LogTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterAsset, setFilterAsset] = useState("");

  const { data, isLoading, isError } = useLogs({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "loggedAt",
    direction: sorting[0]?.desc ? QueryDirection.ASC : QueryDirection.DESC,
    search,
  });

  const responseData = data?.data as { items?: LogTypes.Service.LogData[]; count?: number } | undefined;
  const rawItems = useMemo(() => responseData?.items || [], [responseData?.items]);

  const filtered = useMemo(() => {
    return rawItems.filter((row) => {
      const matchDriver = !filterDriver || row.driverId === filterDriver;
      const matchVehicle = !filterVehicle || row.vehicleId === filterVehicle;
      const matchAsset = !filterAsset || row.assetId === filterAsset;
      return matchDriver && matchVehicle && matchAsset;
    });
  }, [rawItems, filterDriver, filterVehicle, filterAsset]);

  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: filtered,
    columns: logColumns,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
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
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
