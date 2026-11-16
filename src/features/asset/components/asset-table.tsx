"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Truck, Cpu, Layers } from "lucide-react";
import { DataGrid } from "@/components/data-grid";
import { assetColumns } from "@/features/asset/components/asset-columns";
import { AssetTableToolbar } from "@/features/asset/components/asset-table-toolbar";
import { AssetFormDialog } from "@/features/asset/components/asset-form-dialog";
import { useAssets } from "@/features/asset/hooks/use-asset-queries";

export function AssetTable() {
    const [assetOpen, setAssetOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "vehicle" | "equipment">("all");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data, isLoading, isError } = useAssets(
        useMemo(
            () => ({
                page: pagination.pageIndex + 1,
                itemPerPage: pagination.pageSize,
                search: search,
                category: activeTab,
            }),
            [pagination, search, activeTab]
        )
    );

    const items = (data?.data as any)?.items ?? [];
    const counts = (data?.data as any)?.counts || { all: items.length, vehicle: 0, equipment: 0 };

    const table = useReactTable({
        data: items,
        columns: assetColumns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    return (
        <div className="space-y-4">
            {/* Tab Filter: Kendaraan Bergerak vs Alat Berat / Genset */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EDEAE0]/50 rounded-xl w-fit border border-[#DEDAD0]">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("all");
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "all"
                            ? "bg-white text-[#1D6B5A] shadow-xs"
                            : "text-[#7A7A72] hover:text-[#1A1A18]"
                    }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Semua Aset</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "all" ? "bg-[#1D6B5A]/10 text-[#1D6B5A]" : "bg-[#EDEAE0] text-[#7A7A72]"}`}>
                        {counts.all ?? 0}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("vehicle");
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "vehicle"
                            ? "bg-white text-[#1D6B5A] shadow-xs"
                            : "text-[#7A7A72] hover:text-[#1A1A18]"
                    }`}
                >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Armada Kendaraan</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "vehicle" ? "bg-[#1D6B5A]/10 text-[#1D6B5A]" : "bg-[#EDEAE0] text-[#7A7A72]"}`}>
                        {counts.vehicle ?? 0}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("equipment");
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "equipment"
                            ? "bg-white text-[#1D6B5A] shadow-xs"
                            : "text-[#7A7A72] hover:text-[#1A1A18]"
                    }`}
                >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Alat Berat &amp; Genset</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "equipment" ? "bg-[#1D6B5A]/10 text-[#1D6B5A]" : "bg-[#EDEAE0] text-[#7A7A72]"}`}>
                        {counts.equipment ?? 0}
                    </span>
                </button>
            </div>

            <AssetTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAdd={() => setAssetOpen(true)}
            />
            <div className="overflow-x-auto rounded-lg border border-border">
                <DataGrid
                    table={table}
                    columnsLength={assetColumns.length}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
            <AssetFormDialog
                open={assetOpen}
                setOpen={setAssetOpen}
                defaultCategory={activeTab === "equipment" ? "equipment" : "vehicle"}
            />
        </div>
    );
}
