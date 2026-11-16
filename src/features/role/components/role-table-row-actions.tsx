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
import { useDeleteRole } from "@/features/role/hooks/role-users-queries";
import { RoleFormDialog } from "@/features/role/components/role-form-dialog";
import type { RoleData } from "@/types/features/role.type";

interface RoleTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function RoleTableRowActions<TData>({ row }: RoleTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteRole();
    const original = row.original as RoleData;

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
                <RoleFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Role"
                description={`Apakah Anda yakin ingin menghapus role "${original.roleName || (original as any).name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
