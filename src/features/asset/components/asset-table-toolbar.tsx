"use client";

import type { Table } from "@tanstack/table-core";
import { Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";

interface AssetTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    onAdd: () => void;
}

export function AssetTableToolbar<TData>({ table, search, setSearch, onAdd }: AssetTableToolbarProps<TData>) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full sm:w-[280px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A72]" />
                    <Input
                        placeholder="Cari plat nomor, nama armada, tipe..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 pl-8 text-xs bg-[#F7F5EF] border-[#DEDAD0] focus:border-[#1D6B5A]"
                    />
                </div>
                {search && (
                    <Button variant="ghost" onClick={() => setSearch("")} className="h-9 px-2 text-xs text-[#7A7A72]">
                        Reset <X className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2.5">
                <DataTableViewOptions table={table} />
                <Button
                    onClick={onAdd}
                    className="h-9 text-xs font-medium text-white shadow-sm bg-[#1D6B5A] hover:bg-[#155245]"
                >
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Aset
                </Button>
            </div>
        </div>
    );
}
