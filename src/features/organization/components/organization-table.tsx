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
import { mockOrganizations } from "@/lib/mock-data/organization.mock";

export function OrganizationTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() =>
            mockOrganizations.filter((row) =>
                row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.city.toLowerCase().includes(search.toLowerCase()) ||
                row.industry.toLowerCase().includes(search.toLowerCase()) ||
                (row.npwp ?? "").toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: organizationColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <OrganizationTableToolbar table={table} search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={organizationColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>
            <OrganizationFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}