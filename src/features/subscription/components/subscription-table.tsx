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
import { subscriptionColumns } from "@/features/subscription/components/subscription-columns";
import { SubscriptionTableToolbar } from "@/features/subscription/components/subscription-table-toolbar";
import { usePlans } from "@/features/subscription/hooks/subscription-queries";
import type { SubscriptionTypes } from "@/types/features/subscription.type";

export function SubscriptionTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePlans();

  const responseData = data?.data as { items?: SubscriptionTypes.Service.PlanData[] } | SubscriptionTypes.Service.PlanData[] | undefined;
  const rawItems = Array.isArray(responseData) ? responseData : responseData?.items || [];

  const items = useMemo(() => {
    return rawItems.filter((row) =>
      (row.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [rawItems, search]);

  const table = useReactTable({
    data: items,
    columns: subscriptionColumns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <SubscriptionTableToolbar search={search} setSearch={setSearch} />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={subscriptionColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
