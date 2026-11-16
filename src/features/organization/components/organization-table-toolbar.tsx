"use client";

import type { Table } from "@tanstack/table-core";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrganizationTypes } from "@/types/features/organization.type";

interface Props {
    table: Table<OrganizationTypes.Service.OrganizationData>;
    search: string;
    setSearch: (v: string) => void;
    onAdd: () => void;
}

export function OrganizationTableToolbar({ search, setSearch, onAdd }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A72]" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari organisasi..."
                    className="pl-8 h-9 text-sm border-[#DEDAD0] bg-[#F7F5EF] focus:border-[#1D6B5A]"
                />
            </div>
            <Button
                onClick={onAdd}
                className="shrink-0 text-sm font-medium bg-[#1D6B5A] hover:bg-[#155245] text-white shadow-xs"
            >
                <Plus size={16} className="mr-1.5" />
                Tambah Organisasi
            </Button>
        </div>
    );
}