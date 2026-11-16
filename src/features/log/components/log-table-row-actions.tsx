"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Pencil, Trash2, Receipt } from "lucide-react";
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
import { useDeleteLog } from "@/features/log/hooks/use-log-queries";
import { LogFormDialog } from "@/features/log/components/log-form-dialog";
import { LogReceiptDialog } from "@/features/log/components/log-receipt-dialog";
import type { LogTypes } from "@/types/features/log.type";

interface LogTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function LogTableRowActions<TData>({ row }: LogTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const deleteMutation = useDeleteLog();
    const original = row.original as LogTypes.Service.LogData;

    const handleDelete = () => {
        deleteMutation.mutate(original.id, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <>
            <div className="flex items-center gap-1 justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-[#1D6B5A] hover:bg-[#1D6B5A]/10"
                    onClick={() => setReceiptOpen(true)}
                    title="Inspeksi Struk & Emisi"
                >
                    <Receipt className="h-3.5 w-3.5 mr-1" />
                    Struk
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Buka menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem onClick={() => setReceiptOpen(true)} className="cursor-pointer">
                            <Receipt size={14} className="mr-2 text-[#1D6B5A]" />
                            <span>Inspeksi Bukti</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
                            <Pencil size={14} className="mr-2 text-blue-600" />
                            <span>Edit Catatan</span>
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
            </div>

            {receiptOpen && (
                <LogReceiptDialog
                    open={receiptOpen}
                    setOpen={setReceiptOpen}
                    log={original}
                />
            )}

            {editOpen && (
                <LogFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Log Konsumsi BBM"
                description="Apakah Anda yakin ingin menghapus catatan transaksi BBM ini? Tindakan ini akan mengupdate total emisi pada dashboard."
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
