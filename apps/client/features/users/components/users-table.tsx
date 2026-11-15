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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataGrid } from "@/components/data-grid";
import { userColumns } from "@/features/users/components/users-columns";
import { UserTableToolbar } from "@/features/users/components/users-table-toolbar";
import { UserFormDialog } from "@/features/users/components/users-form-dialog";
import { mockUsers } from "@/lib/mock-data/users.mock";

const tabClass =
    "rounded-none border-b-2 border-transparent px-4 pb-2 pt-0 text-sm font-medium text-[#8E8E8E] data-[state=active]:border-[#29A2A5] data-[state=active]:bg-transparent data-[state=active]:text-[#29A2A5] data-[state=active]:shadow-none";

export function UsersTable() {
    const [userOpen, setUserOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const filteredUsers = useMemo(
        () =>
            mockUsers.filter(
                (r) =>
                    r.name.toLowerCase().includes(search.toLowerCase()) ||
                    r.email.toLowerCase().includes(search.toLowerCase()) ||
                    r.role.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const userTable = useReactTable({
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
        <>
            <Tabs
                defaultValue="users"
                onValueChange={() => {
                    setSearch("");
                    setPagination({ pageIndex: 0, pageSize: 10 });
                }}
                className="w-full"
            >

                <TabsContent value="users" className="mt-4 space-y-4">
                    <UserTableToolbar
                        table={userTable}
                        search={search}
                        setSearch={setSearch}
                        onAdd={() => setUserOpen(true)}
                    />
                    <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                        <DataGrid
                            table={userTable}
                            columnsLength={userColumns.length}
                            isLoading={false}
                            isError={false}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="mt-4 space-y-4">
                    {/* Role & Permission table akan diimplementasikan terpisah */}
                </TabsContent>
            </Tabs>

            <UserFormDialog open={userOpen} setOpen={setUserOpen} />
        </>
    );
}