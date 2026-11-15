"use client";

import type { Row } from "@tanstack/table-core";
import { Delete, MoreHorizontal, Pencil } from "lucide-react";
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
import { useDeleteFuelType } from "@/features/fuel-type/hooks/fuel-type-queries";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";
import { FuelTypeFormDialog } from "@/features/fuel-type/components/fuel-type-form-dialog";

interface Props {
    row: Row<FuelTypeTypes.Service.FuelTypeData>;
}

export function FuelTypeTableRowActions({ row }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const deleteFuelType = useDeleteFuelType();
    const original = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                        <Delete size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FuelTypeFormDialog
                open={editOpen}
                setOpen={setEditOpen}
                initialData={original}
            />

            <ConfirmDialog
                title="Hapus Bahan Bakar"
                description={`Apakah Anda yakin ingin menghapus "${original.name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() => {
                    deleteFuelType.mutate(original.id);
                    setDeleteOpen(false);
                }}
                loading={deleteFuelType.isPending}
            />
        </>
    );
}