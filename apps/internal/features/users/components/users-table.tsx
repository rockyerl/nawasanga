"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { type PaginationState, type SortingState } from "@tanstack/table-core";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { userColumns } from "@/features/users/components/users-columns";
import { UsersTableToolbar } from "@/features/users/components/users-table-toolbar";
import { UserFormDialog } from "@/features/users/components/users-form-dialog";
import { mockUsers } from "@/lib/mock-data/users.mock";

export function UsersTable() {
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filteredUsers = useMemo(() =>
            mockUsers.filter((r) =>
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.email.toLowerCase().includes(search.toLowerCase()) ||
                r.role.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const table = useReactTable({
        data: filteredUsers,
        columns: userColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <UsersTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAdd={() => setOpen(true)}
            />

            <div style={{
                borderRadius: "10px",
                border: "1px solid #EDEAE0",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
            }}>
                <DataGrid
                    table={table}
                    columnsLength={userColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>

            <UserFormDialog open={open} setOpen={setOpen} />
        </div>
    );
}