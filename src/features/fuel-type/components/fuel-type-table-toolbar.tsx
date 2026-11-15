"use client";

import type { Table } from "@tanstack/table-core";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";

interface Props {
    table: Table<FuelTypeTypes.Service.FuelTypeData>;
    search: string;
    setSearch: (v: string) => void;
    onAdd: () => void;
}

export function FuelTypeTableToolbar({ search, setSearch, onAdd }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A72]" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari bahan bakar..."
                    className="pl-8 h-9 text-sm border-[#DEDAD0] bg-[#F7F5EF] focus:border-[#1D6B5A]"
                />
            </div>
            <Button
                onClick={onAdd}
                className="shrink-0 text-sm font-medium"
                style={{ background: "#1D6B5A", color: "#F7F5EF" }}
            >
                <Plus size={16} className="mr-1.5" />
                Tambah Bahan Bakar
            </Button>
        </div>
    );
}