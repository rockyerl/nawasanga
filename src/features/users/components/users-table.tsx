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
import { useUsers } from "@/features/users/hooks/use-users-queries";
import { QueryDirection } from "@/types/lib/query.type";
import type { UserTypes } from "@/types/features/user.type";

export function UsersTable() {
  const [userOpen, setUserOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useUsers({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id || "name",
    direction: sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC,
    search,
  });

  const responseData = data?.data as { items?: UserTypes.Service.UserData[]; count?: number } | undefined;
  const items = useMemo(() => responseData?.items || [], [responseData?.items]);
  const pageCount = Math.max(1, Math.ceil((responseData?.count || 0) / pagination.pageSize));

  const userTable = useReactTable({
    data: items,
    columns: userColumns as any,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
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
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-4 space-y-4">
          {/* Role & Permission */}
        </TabsContent>
      </Tabs>

      <UserFormDialog open={userOpen} setOpen={setUserOpen} />
    </>
  );
}
