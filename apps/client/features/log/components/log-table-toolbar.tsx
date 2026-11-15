"use client";

import { useState, useRef, useEffect } from "react";
import type { Table } from "@tanstack/table-core";
import { X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { allDrivers, allVehicles, allAssets } from "@/lib/mock-data/log.mock";

interface LogTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    filterDriver: string;
    setFilterDriver: (value: string) => void;
    filterVehicle: string;
    setFilterVehicle: (value: string) => void;
    filterAsset: string;
    setFilterAsset: (value: string) => void;
}

interface SearchDropdownProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: { id: string; name: string }[];
    label: string;
}

function SearchDropdown({ placeholder, value, onChange, options, label }: SearchDropdownProps) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const filtered = options.filter((o) =>
        o.name.toLowerCase().includes(q.toLowerCase()) || o.id.toLowerCase().includes(q.toLowerCase())
    );

    const selected = options.find((o) => o.id === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setQ("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors
          ${value
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                }`}
            >
        <span className="max-w-[110px] truncate">
          {selected ? selected.name : label}
        </span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
            </button>

            {open && (
                <div className="absolute left-0 top-9 z-50 w-56 rounded-md border border-neutral-200 bg-white shadow-lg">
                    <div className="p-1.5 border-b border-neutral-100">
                        <div className="flex items-center gap-1.5 rounded border border-neutral-200 px-2 py-1">
                            <Search className="h-3 w-3 text-neutral-400" />
                            <input
                                autoFocus
                                className="w-full text-xs outline-none placeholder:text-neutral-400"
                                placeholder={placeholder}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                        {value && (
                            <button
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                                onClick={() => { onChange(""); setOpen(false); setQ(""); }}
                            >
                                <X className="h-3 w-3" /> Hapus filter
                            </button>
                        )}
                        {filtered.length === 0 && (
                            <p className="px-3 py-2 text-xs text-neutral-400">Tidak ditemukan</p>
                        )}
                        {filtered.map((o) => (
                            <button
                                key={o.id}
                                className={`flex w-full flex-col items-start px-3 py-1.5 hover:bg-neutral-50 ${
                                    value === o.id ? "bg-blue-50" : ""
                                }`}
                                onClick={() => { onChange(o.id); setOpen(false); setQ(""); }}
                            >
                <span className={`text-xs font-medium ${value === o.id ? "text-blue-600" : "text-gray-700"}`}>
                  {o.name}
                </span>
                                <span className="text-[10px] text-neutral-400">{o.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function LogTableToolbar<TData>({
                                           table,
                                           search,
                                           setSearch,
                                           filterDriver,
                                           setFilterDriver,
                                           filterVehicle,
                                           setFilterVehicle,
                                           filterAsset,
                                           setFilterAsset,
                                       }: LogTableToolbarProps<TData>) {
    const isFiltered =
        !!search || !!filterDriver || !!filterVehicle || !!filterAsset;

    const handleReset = () => {
        setSearch("");
        setFilterDriver("");
        setFilterVehicle("");
        setFilterAsset("");
        table.resetColumnFilters();
    };

    return (
        <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    placeholder="Cari log ID, driver..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-[180px]"
                />
                <SearchDropdown
                    label="Driver"
                    placeholder="Cari driver..."
                    value={filterDriver}
                    onChange={setFilterDriver}
                    options={allDrivers}
                />
                <SearchDropdown
                    label="Kendaraan"
                    placeholder="Cari kendaraan..."
                    value={filterVehicle}
                    onChange={setFilterVehicle}
                    options={allVehicles}
                />
                <SearchDropdown
                    label="Aset"
                    placeholder="Cari aset..."
                    value={filterAsset}
                    onChange={setFilterAsset}
                    options={allAssets}
                />
                {isFiltered && (
                    <Button variant="ghost" onClick={handleReset} className="h-8 px-2 text-xs">
                        Reset <X className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}