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
import { locationColumns } from "@/features/location/components/location-columns";
import { LocationTableToolbar } from "@/features/location/components/location-table-toolbar";
import { LocationFormDialog } from "@/features/location/components/location-form-dialog";
import { BranchHierarchyGeofence } from "@/features/location/components/branch-hierarchy-geofence";
import { useLocations } from "@/features/location/hooks/use-location-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { LocationTypes } from "@/types/features/location.type";
import { Layers, Table as TableIcon } from "lucide-react";

export function LocationTable() {
  const [activeTab, setActiveTab] = useState<"hierarchy" | "table">("hierarchy");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useLocations({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: LocationTypes.Service.LocationData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
    columns: locationColumns,
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
    <div className="space-y-6">
      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-[#EDEAE0] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("hierarchy")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === "hierarchy"
                ? "bg-[#1D6B5A] text-white shadow-xs"
                : "bg-white text-gray-600 border border-[#DEDAD0] hover:bg-neutral-50"
            }`}
          >
            <Layers size={14} />
            Hierarki Multi-Cabang &amp; Geofencing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === "table"
                ? "bg-[#1D6B5A] text-white shadow-xs"
                : "bg-white text-gray-600 border border-[#DEDAD0] hover:bg-neutral-50"
            }`}
          >
            <TableIcon size={14} />
            Tabel Master Lokasi
          </button>
        </div>

        <span className="text-[11px] text-[#7A7A72] hidden sm:inline">
          Monitoring Geofence SPBU &amp; Alokasi Armada Per Pool
        </span>
      </div>

      {/* Render active view */}
      {activeTab === "hierarchy" ? (
        <BranchHierarchyGeofence />
      ) : (
        <div className="space-y-4">
          <LocationTableToolbar
            table={table}
            search={search}
            setSearch={setSearch}
            onAdd={() => setOpen(true)}
          />
          <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
            <DataGrid
              table={table}
              columnsLength={locationColumns.length}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </div>
      )}

      <LocationFormDialog open={open} setOpen={setOpen} />
    </div>
  );
}
