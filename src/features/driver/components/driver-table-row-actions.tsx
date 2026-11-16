"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteDriver } from "@/features/driver/hooks/driver-queries";
import { DriverFormDialog } from "@/features/driver/components/driver-form-dialog";
import { DriverKycDialog } from "@/features/driver/components/driver-kyc-dialog";
import type { DriverData } from "@/types/features/driver.type";

interface DriverTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DriverTableRowActions<TData>({ row }: DriverTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteDriver();
    const original = row.original as DriverData;

    const handleDelete = () => {
        deleteMutation.mutate(original.id, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => setKycOpen(true)} className="cursor-pointer">
                        <ShieldCheck size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Verifikasi KYC & SIM</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
                        <Pencil size={14} className="mr-2 text-gray-700" />
                        <span>Edit Driver</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {editOpen && (
                <DriverFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            {kycOpen && (
                <DriverKycDialog
                    open={kycOpen}
                    setOpen={setKycOpen}
                    driver={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Driver"
                description={`Apakah Anda yakin ingin menghapus data pengemudi "${original.name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
