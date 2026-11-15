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
import { roleColumns } from "@/features/role/components/role-columns";
import { RoleTableToolbar } from "@/features/role/components/role-table-toolbar";
import { RoleFormDialog } from "@/features/role/components/role-form-dialog";
import { mockRoles } from "@/lib/mock-data/role.mock";

export function RoleTable() {
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            mockRoles.filter(
                (r) =>
                    r.roleName.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: roleColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <div className="space-y-4">
                <RoleTableToolbar
                    table={table}
                    search={search}
                    setSearch={setSearch}
                    onAdd={() => setOpen(true)}
                />
                <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                    <DataGrid
                        table={table}
                        columnsLength={roleColumns.length}
                        isLoading={false}
                        isError={false}
                    />
                </div>
            </div>

            <RoleFormDialog open={open} setOpen={setOpen} />
        </>
    );
}