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
import { billingColumns } from "@/features/billing/components/billing-columns";
import { BillingTableToolbar } from "@/features/billing/components/billing-table-toolbar";
import { mockBillings } from "@/lib/mock-data/billing.mock";

export function BillingTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
            mockBillings.filter((row) =>
                row.organizationName.toLowerCase().includes(search.toLowerCase()) ||
                row.personInCharge.toLowerCase().includes(search.toLowerCase()) ||
                row.subscriptionPlan.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: billingColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <BillingTableToolbar table={table} search={search} setSearch={setSearch} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={billingColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
        </div>
    );
}