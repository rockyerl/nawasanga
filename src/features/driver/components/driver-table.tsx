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
import { driverColumns } from "@/features/driver/components/driver-columns";
import { DriverTableToolbar } from "@/features/driver/components/driver-table-toolbar";
import { DriverFormDialog } from "@/features/driver/components/driver-form-dialog";
import { useDrivers } from "@/features/driver/hooks/driver-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { DriverTypes } from "@/types/features/driver.type";
import { Users, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export function DriverTable() {
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [kycTab, setKycTab] = useState<string>("all");

  const { data, isLoading, isError } = useDrivers({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as {
    items?: DriverTypes.Service.DriverData[];
    count?: number;
    summary?: {
      total: number;
      active: number;
      verifiedKyc: number;
      pendingKyc: number;
      expiringSoon: number;
    };
  } | undefined;

  const rawItems = useMemo(() => responseData?.items || [], [responseData?.items]);
  const summary = (data as any)?.summary || {
    total: rawItems.length,
    active: rawItems.filter((i: any) => i.status === "Aktif").length,
    verifiedKyc: rawItems.filter((i: any) => i.kycStatus === "verified").length,
    expiringSoon: 1,
  };

  const filteredItems = useMemo(() => {
    if (kycTab === "all") return rawItems;
    return rawItems.filter((d: any) => d.kycStatus === kycTab);
  }, [rawItems, kycTab]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pagination.pageSize));

  const table = useReactTable({
    data: filteredItems,
    columns: driverColumns,
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
        {/* KPI Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7A7A72]">Total Pengemudi</span>
              <div className="h-8 w-8 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
              <span className="text-xs text-[#7A7A72]">Personel</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7A7A72]">Pengemudi Aktif</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">{summary.active}</span>
              <span className="text-xs text-emerald-600">Siap Operasional</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7A7A72]">KYC Terverifikasi</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-700">{summary.verifiedKyc}</span>
              <span className="text-xs text-blue-600">Dokumen Valid</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7A7A72]">Perlu Perpanjangan SIM</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-700">{summary.expiringSoon}</span>
              <span className="text-xs text-amber-600">&lt; 90 Hari</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] p-1 text-xs">
            <button
              onClick={() => setKycTab("all")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                kycTab === "all" ? "bg-white text-gray-900 shadow-xs" : "text-[#7A7A72] hover:text-gray-900"
              }`}
            >
              Semua Pengemudi ({rawItems.length})
            </button>
            <button
              onClick={() => setKycTab("verified")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                kycTab === "verified" ? "bg-white text-emerald-800 shadow-xs" : "text-[#7A7A72] hover:text-emerald-700"
              }`}
            >
              KYC Terverifikasi
            </button>
            <button
              onClick={() => setKycTab("pending")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                kycTab === "pending" ? "bg-white text-amber-800 shadow-xs" : "text-[#7A7A72] hover:text-amber-700"
              }`}
            >
              Menunggu Review
            </button>
          </div>

          <DriverTableToolbar
            table={table}
            search={search}
            setSearch={setSearch}
            onAdd={() => setOpen(true)}
          />
        </div>

        <div className="rounded-xl border border-[#EDEAE0] bg-white overflow-hidden shadow-xs">
          <DataGrid
            table={table}
            columnsLength={driverColumns.length}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>

      <DriverFormDialog open={open} setOpen={setOpen} />
    </>
  );
}
