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
import { accountColumns } from "@/features/account/components/account-columns";
import { AccountTableToolbar } from "@/features/account/components/account-table-toolbar";
import { AccountFormDialog } from "@/features/account/components/account-form-dialog";
import { mockAccounts } from "@/lib/mock-data/account.mock";

export function AccountTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() =>
            mockAccounts.filter((row) =>
                row.companyName.toLowerCase().includes(search.toLowerCase()) ||
                row.picName.toLowerCase().includes(search.toLowerCase()) ||
                row.email.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: accountColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <AccountTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={accountColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <AccountFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}