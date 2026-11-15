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
import { useVehicleTypes } from "@/features/vehicle-type/hooks/vehicle-type-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { VehicleTypeTypes } from "@/types/features/vehicle-type.type";

export function VehicleTypeTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useVehicleTypes({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: VehicleTypeTypes.Service.VehicleTypeData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: vehicleTypeColumns,
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
      <VehicleTypeTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={vehicleTypeColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <VehicleTypeFormDialog open={open} setOpen={setOpen} />
    </div>
  );
}
