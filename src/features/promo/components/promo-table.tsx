"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { promoColumns } from "./promo-columns";
import { PromoTableToolbar } from "./promo-table-toolbar";
import { PromoFormDialog } from "./promo-form-dialog";
import { usePromos } from "@/features/promo/hooks/promo-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { PromoTypes } from "@/types/features/promo.type";

export function PromoTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoTypes.Service.PromoData | undefined>();

  const { data, isLoading, isError } = usePromos({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "createdAt",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: PromoTypes.Service.PromoData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: promoColumns,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onEdit: (data: PromoTypes.Service.PromoData) => {
        setSelectedPromo(data);
        setFormOpen(true);
      },
    },
  });

  return (
    <div className="space-y-4">
      <PromoTableToolbar
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setSelectedPromo(undefined);
          setFormOpen(true);
        }}
      />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid table={table} columnsLength={promoColumns.length} isLoading={isLoading} isError={isError} />
      </div>
      <PromoFormDialog open={formOpen} setOpen={setFormOpen} initialData={selectedPromo} />
    </div>
  );
}
