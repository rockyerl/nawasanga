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
import { articleColumns } from "./article-columns";
import { ArticleTableToolbar } from "./article-table-toolbar";
import { ArticleFormDialog } from "./article-form-dialog";
import { useArticles } from "@/features/article/hooks/article-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { ArticleTypes } from "@/types/features/article.type";
import { BookOpen, CheckCircle, FileText, Eye } from "lucide-react";

export function ArticleTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleTypes.Service.ArticleData | undefined>();

  const { data, isLoading, isError } = useArticles({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "publishedAt",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: ArticleTypes.Service.ArticleData[]; count?: number } | undefined;
  const rawItems = useMemo(() => responseData?.items || [], [responseData?.items]);

  const summary = useMemo(() => {
    const totalViews = rawItems.reduce((acc, curr) => acc + (curr.views || 0), 0);
    return {
      total: rawItems.length,
      published: rawItems.filter((a) => a.status === "published").length,
      draft: rawItems.filter((a) => a.status === "draft").length,
      totalViews,
    };
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (statusTab === "all") return rawItems;
    return rawItems.filter((a) => a.status === statusTab);
  }, [rawItems, statusTab]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pagination.pageSize));

  const table = useReactTable({
    data: filteredItems,
    columns: articleColumns,
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
      onEdit: (data: ArticleTypes.Service.ArticleData) => {
        setSelectedArticle(data);
        setFormOpen(true);
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Total Artikel</span>
            <div className="h-8 w-8 rounded-lg bg-[#1D6B5A]/10 text-[#1D6B5A] flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
            <span className="text-xs text-[#7A7A72]">Publikasi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Diterbitkan</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{summary.published}</span>
            <span className="text-xs text-emerald-600">Live di Portal</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Draf Konten</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{summary.draft}</span>
            <span className="text-xs text-amber-600">Dalam Penulisan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#EDEAE0] bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A7A72]">Total Pembaca</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">{summary.totalViews}</span>
            <span className="text-xs text-blue-600">Tayangan</span>
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
            Semua ({rawItems.length})
          </button>
          <button
            onClick={() => setStatusTab("published")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "published" ? "bg-white text-emerald-800 shadow-xs" : "text-[#7A7A72] hover:text-emerald-700"
            }`}
          >
            Diterbitkan ({summary.published})
          </button>
          <button
            onClick={() => setStatusTab("draft")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusTab === "draft" ? "bg-white text-amber-800 shadow-xs" : "text-[#7A7A72] hover:text-amber-700"
            }`}
          >
            Draf ({summary.draft})
          </button>
        </div>

        <ArticleTableToolbar
          search={search}
          setSearch={setSearch}
          onAdd={() => {
            setSelectedArticle(undefined);
            setFormOpen(true);
          }}
        />
      </div>

      <div className="rounded-xl border border-[#EDEAE0] bg-white overflow-hidden shadow-xs">
        <DataGrid
          table={table}
          columnsLength={articleColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <ArticleFormDialog open={formOpen} setOpen={setFormOpen} initialData={selectedArticle} />
    </div>
  );
}
