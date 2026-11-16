"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { useDeleteLocation } from "@/features/location/hooks/use-location-queries";
import { LocationFormDialog } from "@/features/location/components/location-form-dialog";
import type { Location } from "@/types/features/location.type";

interface LocationTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function LocationTableRowActions<TData>({ row }: LocationTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteLocation();
    const original = row.original as Location;

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
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
                        <Pencil size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Edit</span>
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
                <LocationFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Lokasi"
                description={`Apakah Anda yakin ingin menghapus lokasi "${original.name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
