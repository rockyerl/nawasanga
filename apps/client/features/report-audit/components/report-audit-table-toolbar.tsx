"use client";

import type { Table } from "@tanstack/table-core";
import { X, Lock, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import type { PlanType } from "@/types/features/report-audit.type";

interface ReportAuditTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    plan: PlanType;
}

export function ReportAuditTableToolbar<TData>({
                                                   table,
                                                   search,
                                                   setSearch,
                                                   plan,
                                               }: ReportAuditTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Cari insight atau tipe..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {(search || isFiltered) && (
                    <Button
                        variant="ghost"
                        onClick={() => { setSearch(""); table.resetColumnFilters(); }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Export ESG — enterprise only */}
                {plan !== "enterprise" ? (
                    <button
                        disabled
                        title="Tersedia di Enterprise"
                        className="flex items-center gap-1.5 h-8 text-xs text-neutral-300 border border-neutral-200 rounded px-2.5 cursor-not-allowed"
                    >
                        <Lock className="h-3 w-3" /> Export ESG
                    </button>
                ) : (
                    <button className="flex items-center gap-1.5 h-8 text-xs font-medium text-white bg-[#EF9F27] rounded px-2.5 hover:opacity-90 transition-opacity">
                        <FileDown className="h-3.5 w-3.5" /> Export ESG
                    </button>
                )}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}