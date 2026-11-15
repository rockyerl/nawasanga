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
import { subscriptionColumns } from "@/features/subscription/components/subscription-columns";
import { SubscriptionTableToolbar } from "@/features/subscription/components/subscription-table-toolbar";
import { mockPlans } from "@/lib/mock-data/subscription.mock";

export function SubscriptionTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
            mockPlans.filter((row) =>
                row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.description.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: subscriptionColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <SubscriptionTableToolbar search={search} setSearch={setSearch} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={subscriptionColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
        </div>
    );
}