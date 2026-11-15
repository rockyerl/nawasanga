"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { promoColumns } from "./promo-columns";
import { PromoTableToolbar } from "./promo-table-toolbar";
import { PromoFormDialog } from "./promo-form-dialog";
import { mockPromos } from "@/lib/mock-data/promo.mock";
import { PromoTypes } from "@/types/features/promo.type";

export function PromoTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<PromoTypes.Service.PromoData | undefined>();

    const filtered = useMemo(() =>
        mockPromos.filter((row) =>
            row.title.toLowerCase().includes(search.toLowerCase()) ||
            row.code.toLowerCase().includes(search.toLowerCase())
        ), [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: promoColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        meta: {
            onEdit: (data: PromoTypes.Service.PromoData) => {
                setSelectedPromo(data);
                setFormOpen(true);
            }
        },
    });

    return (
        <div className="space-y-4">
            <PromoTableToolbar
                search={search}
                setSearch={setSearch}
                onAdd={() => { setSelectedPromo(undefined); setFormOpen(true); }}
            />
            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid table={table} columnsLength={promoColumns.length} isLoading={false} isError={false} />
            </div>
            <PromoFormDialog open={formOpen} setOpen={setFormOpen} initialData={selectedPromo} />
        </div>
    );
}