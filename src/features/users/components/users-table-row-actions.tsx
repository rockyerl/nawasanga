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
import { useDeleteUserPage } from "@/features/users/hooks/use-users-queries";
import { UserFormDialog } from "@/features/users/components/users-form-dialog";
import type { UserData } from "@/types/features/user.type";

interface UserTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function UserTableRowActions<TData>({ row }: UserTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteUserPage();
    const original = row.original as UserData;

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
                <UserFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Pengguna"
                description={`Apakah Anda yakin ingin menghapus pengguna "${original.name}" (${original.email})? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
