"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Pencil, Trash2, QrCode } from "lucide-react";
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
import { useDeleteAsset } from "@/features/asset/hooks/use-asset-queries";
import { AssetFormDialog } from "@/features/asset/components/asset-form-dialog";
import { AssetQrDialog } from "@/features/asset/components/asset-qr-dialog";
import { AssetTypes } from "@/types/features/asset.type";

interface Props {
    row: Row<AssetTypes.Service.AssetData>;
}

export function AssetTableRowActions({ row }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const deleteAsset = useDeleteAsset();
    const original = row.original;

    const handleDelete = () => {
        deleteAsset.mutate(original.id, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <>
            <div className="flex items-center gap-1 justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-[#1D6B5A] hover:bg-[#1D6B5A]/10 font-medium"
                    onClick={() => setQrOpen(true)}
                    title="Cetak Stiker QR Armada"
                >
                    <QrCode className="h-3.5 w-3.5 mr-1" />
                    Stiker QR
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Buka menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[170px]">
                        <DropdownMenuItem onClick={() => setQrOpen(true)} className="cursor-pointer">
                            <QrCode size={14} className="mr-2 text-[#1D6B5A]" />
                            <span>Cetak Stiker QR</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
                            <Pencil size={14} className="mr-2 text-blue-600" />
                            <span>Edit Aset</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setDeleteOpen(true)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                            <Trash2 size={14} className="mr-2 text-red-500" />
                            <span className="text-red-500">Hapus Aset</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {qrOpen && (
                <AssetQrDialog
                    open={qrOpen}
                    setOpen={setQrOpen}
                    asset={original as any}
                />
            )}

            {editOpen && (
                <AssetFormDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    initialData={original}
                />
            )}

            <ConfirmDialog
                title="Hapus Aset"
                description={`Apakah Anda yakin ingin menghapus aset "${original.name || original.serialNumber}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteAsset.isPending}
            />
        </>
    );
}
