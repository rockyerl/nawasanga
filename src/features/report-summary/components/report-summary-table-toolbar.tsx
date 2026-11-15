import type { Table } from "@tanstack/table-core";
import { X, Download, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import type { PlanType } from "@/types/features/report-summary.type";

interface ReportTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    plan: PlanType;
}

export function ReportTableToolbar<TData>({ table, search, setSearch, plan }: ReportTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search report ID, period..."
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
                {/* Export PDF */}
                {plan === "trial" ? (
                    <button
                        disabled
                        title="Tersedia di Starter ke atas"
                        className="flex items-center gap-1.5 h-8 text-xs text-neutral-300 border border-neutral-200 rounded px-2.5 cursor-not-allowed"
                    >
                        <Lock className="h-3 w-3" /> Export PDF
                    </button>
                ) : (
                    <button className="flex items-center gap-1.5 h-8 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 hover:bg-neutral-50 transition-colors">
                        <Download className="h-3 w-3" /> Export PDF
                    </button>
                )}

                {/* Export Excel - pro & enterprise saja */}
                {(plan === "pro" || plan === "enterprise") && (
                    <button className="flex items-center gap-1.5 h-8 text-xs text-[#8E8E8E] border border-neutral-200 rounded px-2.5 hover:bg-neutral-50 transition-colors">
                        <FileText className="h-3 w-3" /> Export Excel
                    </button>
                )}

                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}