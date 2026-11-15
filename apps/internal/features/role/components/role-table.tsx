"use client";

import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid";
import { roleColumns } from "./role-columns";
import { RoleTableToolbar } from "./role-table-toolbar";
import { RoleFormDialog } from "./role-form-dialog";
import { useRoles } from "../hooks/role-queries";

export function RoleTable() {
    const { data = [], isLoading, isError } = useRoles();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const filteredData = useMemo(
        () => data.filter((r: any) => r.name.toLowerCase().includes(search.toLowerCase())),
        [data, search]
    );

    const table = useReactTable({
        data: filteredData,
        columns: roleColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <RoleTableToolbar search={search} setSearch={setSearch} onAdd={() => setOpen(true)} />

            <RoleFormDialog open={open} setOpen={setOpen} initialData={null} />

            <div
                style={{
                    borderRadius: "10px",
                    border: "1px solid #EDEAE0",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                }}
            >
                <DataGrid
                    table={table}
                    columnsLength={roleColumns.length}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
        </div>
    );
}