"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
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
import { BillingTypes } from "@/types/features/billing.type";

interface Props {
    row: Row<BillingTypes.Service.BillingData>;
}

export function BillingTableRowActions({ row }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const original = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>
                        <Eye size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Detail Invoice</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus Log</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                title="Hapus Riwayat"
                description={`Hapus riwayat pembayaran "${original.organizationName}"?`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() => setDeleteOpen(false)}
            />
        </>
    );
}