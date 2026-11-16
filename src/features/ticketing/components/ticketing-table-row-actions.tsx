"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Eye, Trash2, Edit } from "lucide-react";
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
import { useDeleteTicket } from "@/features/ticketing/hooks/ticketing-queries";
import { TicketDetailDialog } from "@/features/ticketing/components/ticket-detail-dialog";

interface Props {
    row: Row<TicketingTypes.Service.TicketData>;
    onEdit: (data: TicketingTypes.Service.TicketData) => void;
}

export function TicketingTableRowActions({ row, onEdit }: Props) {
    const [detailOpen, setDetailOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteTicket();
    const original = row.original;

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
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => setDetailOpen(true)} className="cursor-pointer">
                        <Eye size={14} className="mr-2 text-gray-700" />
                        <span>Lihat Rincian</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(original)} className="cursor-pointer">
                        <Edit size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Update Status / Respon</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus Tiket</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <TicketDetailDialog
                open={detailOpen}
                setOpen={setDetailOpen}
                ticket={original}
                onEditStatus={(t) => onEdit(t)}
            />

            <ConfirmDialog
                title="Hapus Tiket"
                description={`Apakah Anda yakin ingin menghapus tiket bantuan "${original.reportType || original.subject}" dari "${original.organizationName}"?`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
        </>
    );
}
