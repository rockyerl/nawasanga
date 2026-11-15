"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Eye, Trash2, Edit, Download } from "lucide-react";
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
import { TicketingTypes } from "@/types/features/ticketing.type";

interface Props {
    row: Row<TicketingTypes.Service.TicketData>;
    onEdit: (data: TicketingTypes.Service.TicketData) => void;
}

export function TicketingTableRowActions({ row, onEdit }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const original = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => onEdit(original)}>
                        <Edit size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Update Status</span>
                    </DropdownMenuItem>
                    {original.attachmentUrl && (
                        <DropdownMenuItem>
                            <Download size={14} className="mr-2 text-[#1D6B5A]" />
                            <span>Unduh Lampiran</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus Tiket</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                title="Hapus Tiket"
                description={`Hapus tiket dari "${original.organizationName}"?`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() => setDeleteOpen(false)}
            />
        </>
    );
}