"use client";

import type { Row } from "@tanstack/table-core";
import { Trash2, MoreHorizontal, Pencil } from "lucide-react";
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
import { useDeleteAsset } from "@/features/operational/hooks/operational-user-queries";
import { AssetFormDialog } from "@/features/operational/components/operational-form-dialog";
import { OperationalTypes } from "@/types/features/operational.type";

interface OperationalTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function OperationalTableRowActions<TData>({ row }: OperationalTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteAsset = useDeleteAsset();

    const original = row.original as unknown as OperationalTypes.Service.AssetData;

    const onDelete = () => {
        deleteAsset.mutate(original.id, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Buka Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                        className="cursor-pointer"
                    >
                        <Pencil size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        <span className="text-red-500">Hapus</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {editOpen && (
                <AssetFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Aset"
                description={`Apakah Anda yakin ingin menghapus "${original.name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={onDelete}
                loading={deleteAsset.isPending}
            />
        </>
    );
}
