"use client";

import type { Table } from "@tanstack/table-core";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import type { PlanType } from "@/types/features/report-tren.type";

interface ReportTrenTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    plan: PlanType;
    onExport?: () => void;
}

export function ReportTrenTableToolbar<TData>({
                                                  table,
                                                  search,
                                                  setSearch,
                                                  plan,
                                                  onExport,
                                              }: ReportTrenTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Cari label atau tren..."
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
                {/* Export — pro+ only */}
                {plan === "trial" || plan === "starter" ? (
                    <button
                        disabled
                        title="Tersedia di Pro ke atas"
                        className="flex items-center gap-1.5 h-8 text-xs text-neutral-300 border border-neutral-200 rounded px-2.5 cursor-not-allowed"
                    >
                        <Lock className="h-3 w-3" /> Export
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onExport}
                        className="flex items-center gap-1.5 h-8 text-xs text-[#1D6B5A] border border-[#1D6B5A]/30 bg-[#1D6B5A]/5 rounded px-2.5 hover:bg-[#1D6B5A]/10 transition-colors font-medium cursor-pointer"
                    >
                        Export CSV
                    </button>
                )}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}