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
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function TicketingTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
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
  const rawItems = useMemo(() => responseData?.items || [], [responseData?.items]);

  const summary = (data as any)?.summary || {
    total: rawItems.length,
    open: rawItems.filter((i) => i.status === "baru").length,
    inProgress: rawItems.filter((i) => i.status === "on progress").length,
    resolved: rawItems.filter((i) => i.status === "selesai").length,
  };

  const filteredItems = useMemo(() => {
    if (statusTab === "all") return rawItems;
    return rawItems.filter((i) => i.status === statusTab);
  }, [rawItems, statusTab]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pagination.pageSize));

  const table = useReactTable({
    data: filteredItems,
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
      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Total Tiket</span>
            <div className="h-8 w-8 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A] flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
            <span className="text-xs text-[#7A7A72]">Permohonan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Tiket Baru</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">{summary.open}</span>
            <span className="text-xs text-blue-600">Menunggu Respon</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Sedang Ditangani</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{summary.inProgress}</span>
            <span className="text-xs text-amber-600">Dalam Pengerjaan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Tiket Selesai</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{summary.resolved}</span>
            <span className="text-xs text-emerald-600">Terselesaikan</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] p-1 text-xs">
          <button
            onClick={() => setStatusTab("all")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "all" ? "bg-white text-gray-900 shadow-xs" : "text-[#7A7A72] hover:text-gray-900"
            }`}
          >
            Semua ({rawItems.length})
          </button>
          <button
            onClick={() => setStatusTab("baru")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "baru" ? "bg-white text-blue-800 shadow-xs" : "text-[#7A7A72] hover:text-blue-700"
            }`}
          >
            Baru ({summary.open})
          </button>
          <button
            onClick={() => setStatusTab("on progress")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "on progress" ? "bg-white text-amber-800 shadow-xs" : "text-[#7A7A72] hover:text-amber-700"
            }`}
          >
            On Progress ({summary.inProgress})
          </button>
          <button
            onClick={() => setStatusTab("selesai")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "selesai" ? "bg-white text-emerald-800 shadow-xs" : "text-[#7A7A72] hover:text-emerald-700"
            }`}
          >
            Selesai ({summary.resolved})
          </button>
        </div>

        <TicketingTableToolbar search={search} setSearch={setSearch} onAdd={handleAdd} />
      </div>

      <div className="rounded-xl border border-[#EDEAE0] bg-white overflow-hidden shadow-xs">
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
