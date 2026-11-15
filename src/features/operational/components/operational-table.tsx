"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { DataGrid } from "@/components/data-grid";
import { assetColumns } from "./operational-columns";
import { OperationalTableToolbar } from "./operational-table-toolbar";
import { AssetFormDialog } from "./operational-form-dialog";
import { useAssets } from "../hooks/operational-user-queries";

export function OperationalTable() {
    const [assetOpen, setAssetOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data, isLoading, isError } = useAssets(useMemo(() => ({
        page: pagination.pageIndex + 1,
        itemPerPage: pagination.pageSize,
        search: search
    }), [pagination, search]));

    const items = (data?.data as any)?.items ?? [];

    const table = useReactTable({
        data: items,
        columns: assetColumns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    return (
        <div className="space-y-4">
            <OperationalTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAdd={() => setAssetOpen(true)}
            />
            <div className="overflow-x-auto rounded-lg border border-border">
                <DataGrid
                    table={table}
                    columnsLength={assetColumns.length}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
            <AssetFormDialog open={assetOpen} setOpen={setAssetOpen} />
        </div>
    );
}