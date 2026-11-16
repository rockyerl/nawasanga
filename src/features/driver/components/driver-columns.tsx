"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DriverTableRowActions } from "@/features/driver/components/driver-table-row-actions";
import type { DriverData } from "@/types/features/driver.type";
import { ShieldCheck, ShieldAlert, Clock, Truck, Fuel } from "lucide-react";

export const driverColumns: ColumnDef<DriverData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pengemudi" />,
        cell: ({ row }) => {
            const driver = row.original;
            return (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-900 font-semibold truncate">{driver.name}</span>
                    <span className="text-[11px] text-[#7A7A72] font-mono">
                        {driver.nik ? `NIK: ${driver.nik}` : driver.employeeId}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "licenseType",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis SIM / SIO" />,
        cell: ({ row }) => {
            const type = row.getValue("licenseType") as string;
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="inline-flex w-fit items-center rounded-md bg-[#1D6B5A]/10 px-2 py-0.5 text-xs font-semibold text-[#1D6B5A]">
                        {type}
                    </span>
                    <span className="text-xs text-[#7A7A72] font-mono truncate">{row.original.licenseNumber}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "licenseExpiry",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Masa Berlaku" />,
        cell: ({ row }) => {
            const expiry = row.getValue("licenseExpiry") as string;
            if (!expiry) return <span className="text-xs text-[#7A7A72]">-</span>;
            const expDate = new Date(expiry);
            const isExpiringSoon = expDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            const isExpired = expDate < new Date();

            return (
                <div className="flex flex-col">
                    <span
                        className="text-xs font-medium"
                        style={{
                            color: isExpired ? "#ef4444" : isExpiringSoon ? "#d97706" : "#4A4A45",
                        }}
                    >
                        {expDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[10px]" style={{ color: isExpired ? "#ef4444" : isExpiringSoon ? "#d97706" : "#7A7A72" }}>
                        {isExpired ? "Kadaluarsa" : isExpiringSoon ? "Perlu Perpanjangan" : "Aktif"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "kycStatus",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status KYC" />,
        cell: ({ row }) => {
            const status = row.original.kycStatus || "verified";
            if (status === "verified") {
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" /> Terverifikasi
                    </span>
                );
            }
            if (status === "pending") {
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" /> Menunggu Review
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                    <ShieldAlert className="h-3 w-3" /> Ditolak
                </span>
            );
        },
    },
    {
        accessorKey: "assignedVehiclePlate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Armada Tertaut" />,
        cell: ({ row }) => {
            const plate = row.original.assignedVehiclePlate;
            if (!plate) return <span className="text-xs text-[#7A7A72] italic">Belum ada</span>;
            return (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-gray-800 bg-neutral-100 px-2 py-0.5 rounded">
                    <Truck className="h-3 w-3 text-[#1D6B5A]" /> {plate}
                </span>
            );
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kontak & Pool" />,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs text-gray-800 font-medium truncate">{row.getValue("phone")}</span>
                <span className="text-[11px] text-[#7A7A72] truncate">{row.original.locationName || "Pool Cikarang"}</span>
            </div>
        ),
    },
    {
        accessorKey: "fuelLogCount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aktivitas BBM" />,
        cell: ({ row }) => {
            const count = row.original.fuelLogCount || 0;
            const liters = row.original.totalLiters || 0;
            return (
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <Fuel className="h-3.5 w-3.5 text-[#1D6B5A]" />
                    <span>{count} log ({liters} L)</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const isActive = status === "Aktif";
            return (
                <span className="inline-flex items-center gap-1.5">
                    <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: isActive ? "#22c55e" : "#f97316" }}
                    />
                    <span className="text-xs font-medium" style={{ color: isActive ? "#15803d" : "#c2410c" }}>
                        {status}
                    </span>
                </span>
            );
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <DriverTableRowActions row={row} />,
    },
];
