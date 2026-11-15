"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { ticketingColumns } from "./ticketing-columns";
import { TicketingTableToolbar } from "./ticketing-table-toolbar"; // Gunakan toolbar yang sudah dibuat
import { TicketingFormDialog } from "./ticketing-form-dialog";
import { mockTickets } from "@/lib/mock-data/ticketing.mock";
import { TicketingTypes } from "@/types/features/ticketing.type";

export function TicketingTable() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketingTypes.Service.TicketData | undefined>();

    const filtered = useMemo(() =>
        mockTickets.filter((row) =>
            row.organizationName.toLowerCase().includes(search.toLowerCase()) ||
            row.customerName.toLowerCase().includes(search.toLowerCase())
        ), [search]
    );

    const table = useReactTable({
        data: filtered,
        columns: ticketingColumns,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        meta: {
            onEdit: (data: TicketingTypes.Service.TicketData) => {
                setSelectedTicket(data);
                setFormOpen(true);
            }
        },
    });

    const handleAdd = () => {
        setSelectedTicket(undefined);
        setFormOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Menggunakan Toolbar agar konsisten dengan fitur lain */}
            <TicketingTableToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />

            <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                <DataGrid
                    table={table}
                    columnsLength={ticketingColumns.length}
                    isLoading={false}
                    isError={false}
                />
            </div>

            <TicketingFormDialog
                open={formOpen}
                setOpen={setFormOpen}
                initialData={selectedTicket}
            />
        </div>
    );
}