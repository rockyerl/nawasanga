import { useState, useRef, useEffect } from "react";
import type { Row } from "@tanstack/table-core";
import { MoreVertical, Eye, Download, FileText, Pencil, Trash2, Lock } from "lucide-react";
import type { PlanType } from "@/lib/mock-data/report-summary.mock";

interface ReportTableRowActionsProps<TData> {
    row: Row<TData>;
    plan: PlanType;
}

export function ReportTableRowActions<TData>({ row: _, plan }: ReportTableRowActionsProps<TData>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="text-[#8E8E8E] hover:text-gray-700 p-1 rounded hover:bg-neutral-100 transition-colors"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-7 z-50 bg-white rounded-lg border border-neutral-200 shadow-md py-1 min-w-[160px]">
                    {/* Lihat Detail - semua plan */}
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat Detail
                    </button>

                    {/* Download PDF - trial terkunci */}
                    {plan === "trial" ? (
                        <button
                            disabled
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 cursor-not-allowed"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Download PDF
                            <span className="ml-auto text-[9px] bg-neutral-100 text-neutral-400 rounded px-1 py-0.5">Starter+</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download PDF
                        </button>
                    )}

                    {/* Download Excel - trial & starter terkunci */}
                    {plan === "trial" || plan === "starter" ? (
                        <button
                            disabled
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 cursor-not-allowed"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Download Excel
                            <span className="ml-auto text-[9px] bg-neutral-100 text-neutral-400 rounded px-1 py-0.5">Pro+</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            Download Excel
                        </button>
                    )}

                    {/* Edit & Hapus - pro & enterprise saja */}
                    {(plan === "pro" || plan === "enterprise") && (
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </button>
                    )}

                    {plan === "enterprise" && (
                        <>
                            <div className="my-1 border-t border-neutral-100" />
                            <button
                                onClick={() => setOpen(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}