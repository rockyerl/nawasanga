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
import { organizationColumns } from "@/features/organization/components/organization-columns";
import { OrganizationTableToolbar } from "@/features/organization/components/organization-table-toolbar";
import { OrganizationFormDialog } from "@/features/organization/components/organization-form-dialog";
import { useOrganizations } from "@/features/organization/hooks/organization-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { OrganizationTypes } from "@/types/features/organization.type";
import { Building2, ShieldCheck, Clock, Layers } from "lucide-react";

export function OrganizationTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useOrganizations({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: OrganizationTypes.Service.OrganizationData[]; count?: number } | undefined;
  const rawItems = useMemo(() => responseData?.items || [], [responseData?.items]);

  const summary = useMemo(() => {
    const active = rawItems.filter((o) => (o as any).status === "active" || o.isActive).length;
    const pendingKyc = rawItems.filter((o) => (o as any).status === "pending_kyc").length;
    const totalMaxAssets = rawItems.reduce((acc, curr) => acc + (curr.maxAssets || 0), 0);
    return {
      total: rawItems.length,
      active,
      pendingKyc,
      totalMaxAssets,
    };
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (statusTab === "all") return rawItems;
    if (statusTab === "active") return rawItems.filter((o) => (o as any).status === "active" || o.isActive);
    if (statusTab === "pending_kyc") return rawItems.filter((o) => (o as any).status === "pending_kyc");
    return rawItems;
  }, [rawItems, statusTab]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pagination.pageSize));

  const table = useReactTable({
    data: filteredItems,
    columns: organizationColumns,
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
      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Total Tenant Korporat</span>
            <div className="h-8 w-8 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A] flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
            <span className="text-xs text-[#7A7A72]">Perusahaan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Organisasi Aktif</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{summary.active}</span>
            <span className="text-xs text-emerald-600">Beroperasi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Review KYC Menunggu</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{summary.pendingKyc}</span>
            <span className="text-xs text-amber-600">Perlu Persetujuan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Kapasitas Kuota Armada</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">{summary.totalMaxAssets}</span>
            <span className="text-xs text-blue-600">Unit Terdaftar</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-[#EDEAE0] bg-[#F7F5EF] p-1 text-xs">
          <button
            onClick={() => setStatusTab("all")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "all" ? "bg-white text-gray-900 shadow-xs" : "text-[#7A7A72] hover:text-gray-900"
            }`}
          >
            Semua Organisasi ({rawItems.length})
          </button>
          <button
            onClick={() => setStatusTab("active")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "active" ? "bg-white text-emerald-800 shadow-xs" : "text-[#7A7A72] hover:text-emerald-700"
            }`}
          >
            Aktif ({summary.active})
          </button>
          <button
            onClick={() => setStatusTab("pending_kyc")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "pending_kyc" ? "bg-white text-amber-800 shadow-xs" : "text-[#7A7A72] hover:text-amber-700"
            }`}
          >
            Review KYC ({summary.pendingKyc})
          </button>
        </div>

        <OrganizationTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
      </div>

      <div className="rounded-xl border border-[#EDEAE0] bg-white overflow-hidden shadow-xs">
        <DataGrid
          table={table}
          columnsLength={organizationColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <OrganizationFormDialog open={open} setOpen={setOpen} />
    </div>
  );
}
