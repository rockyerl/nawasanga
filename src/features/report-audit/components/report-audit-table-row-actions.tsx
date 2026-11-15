"use client";

import { useState, useRef, useEffect } from "react";
import type { Row } from "@tanstack/table-core";
import { MoreVertical, Eye, Download, Lock } from "lucide-react";
import { type PlanType, type AuditTypes } from "@/types/features/report-audit.type";

interface ReportAuditTableRowActionsProps {
    row: Row<AuditTypes.Service.InsightItem>;
    plan: PlanType;
}

export function ReportAuditTableRowActions({ row: _, plan }: ReportAuditTableRowActionsProps) {
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
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat Detail
                    </button>

                    {/* Unduh laporan — enterprise only */}
                    {plan !== "enterprise" ? (
                        <button
                            disabled
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 cursor-not-allowed"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Unduh Laporan
                            <span className="ml-auto text-[9px] bg-neutral-100 text-neutral-400 rounded px-1 py-0.5">
                                Enterprise
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-neutral-50 transition-colors"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Unduh Laporan
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}