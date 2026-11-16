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
import { LogFormDialog } from "@/features/log/components/log-form-dialog";
import { useLogs } from "@/features/log/hooks/use-log-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { LogTypes } from "@/types/features/log.type";
import { Fuel, CloudRain, DollarSign, ClipboardList } from "lucide-react";

export function LogTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterAsset, setFilterAsset] = useState("");
  const [formOpen, setFormOpen] = useState(false);

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

  // Aggregate stats from fetched records
  const stats = useMemo(() => {
    const totalCount = responseData?.count || filtered.length;
    let totalLiters = 0;
    let totalCost = 0;
    let totalEmissionKg = 0;

    for (const item of filtered) {
      totalLiters += item.liters || 0;
      totalCost += item.costIdr || 0;
      totalEmissionKg += item.emissionCo2Kg || 0;
    }

    return {
      totalCount,
      totalLiters,
      totalCost,
      totalEmissionTon: (totalEmissionKg / 1000).toFixed(2),
    };
  }, [filtered, responseData?.count]);

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
      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#DEDAD0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#7A7A72] font-medium">Total Transaksi BBM</span>
            <div className="p-1.5 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A]">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">{stats.totalCount}</div>
          <span className="text-[11px] text-[#7A7A72]">Catatan log aktif</span>
        </div>

        <div className="rounded-xl border border-[#DEDAD0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#7A7A72] font-medium">Total Volume Terkonsumsi</span>
            <div className="p-1.5 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A]">
              <Fuel className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {stats.totalLiters.toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">L</span>
          </div>
          <span className="text-[11px] text-[#1D6B5A] font-medium">B35 / Dexlite / Solar</span>
        </div>

        <div className="rounded-xl border border-[#DEDAD0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#7A7A72] font-medium">Total Emisi Karbon (Scope 1)</span>
            <div className="p-1.5 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A]">
              <CloudRain className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#1D6B5A]">
            {stats.totalEmissionTon} <span className="text-xs font-normal">Ton CO₂e</span>
          </div>
          <span className="text-[11px] text-[#7A7A72]">Standar IPCC 2006</span>
        </div>

        <div className="rounded-xl border border-[#DEDAD0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#7A7A72] font-medium">Total Pengeluaran BBM</span>
            <div className="p-1.5 rounded-lg bg-[#B8962E]/15 text-[#B8962E]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">
            Rp {stats.totalCost.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-[#7A7A72]">Biaya terakumulasi</span>
        </div>
      </div>

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
        onAdd={() => setFormOpen(true)}
      />

      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <DataGrid
          table={table}
          columnsLength={logColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <LogFormDialog open={formOpen} setOpen={setFormOpen} />
    </div>
  );
}
