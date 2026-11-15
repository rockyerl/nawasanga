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
import { roleColumns } from "@/features/role/components/role-columns";
import { RoleTableToolbar } from "@/features/role/components/role-table-toolbar";
import { RoleFormDialog } from "@/features/role/components/role-form-dialog";
import { useRoles } from "@/features/role/hooks/role-users-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { RoleTypes } from "@/types/features/role.type";

export function RoleTable() {
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useRoles({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: RoleTypes.Service.RoleData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: roleColumns as any,
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
    <>
      <div className="space-y-4">
        <RoleTableToolbar
          table={table}
          search={search}
          setSearch={setSearch}
          onAdd={() => setOpen(true)}
        />
        <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
          <DataGrid
            table={table}
            columnsLength={roleColumns.length}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
      <RoleFormDialog open={open} setOpen={setOpen} />
    </>
  );
}
