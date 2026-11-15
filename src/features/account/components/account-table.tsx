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
import { accountColumns } from "@/features/account/components/account-columns";
import { AccountTableToolbar } from "@/features/account/components/account-table-toolbar";
import { AccountFormDialog } from "@/features/account/components/account-form-dialog";
import { useAccounts } from "@/features/account/hooks/account-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { AccountTypes } from "@/types/features/account.type";

export function AccountTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useAccounts({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "createdAt",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: AccountTypes.Service.AccountData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: accountColumns,
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
      <AccountTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={accountColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <AccountFormDialog open={open} setOpen={setOpen} />
    </div>
  );
}
