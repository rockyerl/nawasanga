"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { ticketingColumns } from "./ticketing-columns";
import { TicketingTableToolbar } from "./ticketing-table-toolbar";
import { TicketingFormDialog } from "./ticketing-form-dialog";
import { useTicketingList } from "@/features/ticketing/hooks/ticketing-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { TicketingTypes } from "@/types/features/ticketing.type";

export function TicketingTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketingTypes.Service.TicketData | undefined>();

  const { data, isLoading, isError } = useTicketingList({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "createdAt",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: TicketingTypes.Service.TicketData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: ticketingColumns,
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
      onEdit: (data: TicketingTypes.Service.TicketData) => {
        setSelectedTicket(data);
        setFormOpen(true);
      },
    },
  });

  const handleAdd = () => {
    setSelectedTicket(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <TicketingTableToolbar search={search} setSearch={setSearch} onAdd={handleAdd} />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={ticketingColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <TicketingFormDialog open={formOpen} setOpen={setFormOpen} initialData={selectedTicket} />
    </div>
  );
}
