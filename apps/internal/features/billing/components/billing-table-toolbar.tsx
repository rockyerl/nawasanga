"use client";

import type { Table } from "@tanstack/table-core";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BillingTypes } from "@/types/features/billing.type";

interface Props {
    table: Table<BillingTypes.Service.BillingData>;
    search: string;
    setSearch: (v: string) => void;
}

export function BillingTableToolbar({ search, setSearch }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A72]" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari PT atau penanggung jawab..."
                    className="pl-8 h-9 text-sm border-[#DEDAD0] bg-[#F7F5EF] focus:border-[#1D6B5A]"
                />
            </div>
            <Button
                variant="outline"
                className="shrink-0 text-sm font-medium border-[#DEDAD0] text-[#7A7A72]"
            >
                <Download size={16} className="mr-1.5" />
                Ekspor PDF
            </Button>
        </div>
    );
}