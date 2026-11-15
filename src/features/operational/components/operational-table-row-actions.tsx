"use client";

import type { Row } from "@tanstack/table-core";
import { Trash2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteAsset } from "@/features/operational/hooks/operational-user-queries";

interface OperationalTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function OperationalTableRowActions<TData>({ row }: OperationalTableRowActionsProps<TData>) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteAsset = useDeleteAsset(); // Hanya menggunakan hook asset

    const original = row.original as { id: string; name: string };

    const onDelete = () => {
        deleteAsset.mutate(original.id);
        setDeleteOpen(false);
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
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> <span>Hapus</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                title="Hapus Aset"
                description={`Apakah Anda yakin ingin menghapus "${original.name}"?`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={onDelete}
                loading={deleteAsset.isPending}
            />
        </>
    );
}