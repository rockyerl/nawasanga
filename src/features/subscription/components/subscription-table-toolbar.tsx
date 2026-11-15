"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    search:    string;
    setSearch: (v: string) => void;
}

export function SubscriptionTableToolbar({ search, setSearch }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A72]" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari plan..."
                    className="pl-8 h-9 text-sm border-[#DEDAD0] bg-[#F7F5EF] focus:border-[#1D6B5A]"
                />
            </div>
        </div>
    );
}