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

export function ArticleTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
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
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const table = useReactTable({
    data: items,
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
      <ArticleTableToolbar
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setSelectedArticle(undefined);
          setFormOpen(true);
        }}
      />
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
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
