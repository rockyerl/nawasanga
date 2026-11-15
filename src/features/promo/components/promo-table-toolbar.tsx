"use client";

import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
    search: string;
    setSearch: (v: string) => void;
    onAdd: () => void;
}

export function PromoTableToolbar({ search, setSearch, onAdd }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 flex-1">
                <div className="relative w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A72]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau kode promo..."
                        className="pl-8 h-9 text-sm border-[#DEDAD0] bg-[#F7F5EF] focus:border-[#1D6B5A]"
                    />
                </div>
                <Button variant="outline" className="h-9 border-[#DEDAD0] text-[#7A7A72]">
                    <Filter size={14} className="mr-2" />
                    Filter
                </Button>
            </div>
            <Button
                onClick={onAdd}
                className="h-9 text-sm font-medium"
                style={{ background: "#1D6B5A", color: "#F7F5EF" }}
            >
                <Plus size={16} className="mr-1.5" />
                Tambah Promo
            </Button>
        </div>
    );
}