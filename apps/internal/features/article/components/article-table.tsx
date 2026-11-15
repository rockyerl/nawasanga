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
import { mockArticles } from "@/lib/mock-data/article.mock";
import { ArticleTypes } from "@/types/features/article.type";

export function ArticleTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<ArticleTypes.Service.ArticleData | undefined>();

    const filtered = useMemo(() =>
            mockArticles.filter((row) =>
                row.title.toLowerCase().includes(search.toLowerCase()) ||
                row.author.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: articleColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        meta: {
            onEdit: (data: ArticleTypes.Service.ArticleData) => {
                setSelectedArticle(data);
                setFormOpen(true);
            }
        },
    });

    const handleAdd = () => {
        setSelectedArticle(undefined);
        setFormOpen(true);
    };

    return (
        <div className="space-y-4">
            <ArticleTableToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={articleColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <ArticleFormDialog
                open={formOpen}
                setOpen={setFormOpen}
                initialData={selectedArticle}
            />
        </div>
    );
}
