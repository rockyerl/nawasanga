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
import { useFuelTypes } from "@/features/fuel-type/hooks/fuel-type-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { FuelTypeTypes } from "@/types/features/fuel-type.type";

export function FuelTypeTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useFuelTypes({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: FuelTypeTypes.Service.FuelTypeData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: fuelTypeColumns,
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
      <FuelTypeTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={fuelTypeColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <FuelTypeFormDialog open={open} setOpen={setOpen} />
    </div>
  );
}
