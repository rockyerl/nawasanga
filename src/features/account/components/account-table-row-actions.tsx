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
import { useDeleteAccount } from "@/features/account/hooks/account-queries";
import { AccountTypes } from "@/types/features/account.type";
import { AccountFormDialog } from "@/features/account/components/account-form-dialog";

interface Props {
    row: Row<AccountTypes.Service.AccountData>;
}

export function AccountTableRowActions({ row }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const deleteAccount = useDeleteAccount();
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

            <AccountFormDialog
                open={editOpen}
                setOpen={setEditOpen}
                initialData={original}
            />

            <ConfirmDialog
                title="Hapus Akun"
                description={`Apakah Anda yakin ingin menghapus akun "${original.companyName}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() => {
                    deleteAccount.mutate(original.id);
                    setDeleteOpen(false);
                }}
                loading={deleteAccount.isPending}
            />
        </>
    );
}