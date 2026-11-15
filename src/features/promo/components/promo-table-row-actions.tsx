"use client";

import { MoreHorizontal, Send, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePushPromo } from "../hooks/promo-queries"; // Pastikan path benar
import { PromoTypes } from "@/types/features/promo.type";

interface Props {
    row: { original: PromoTypes.Service.PromoData };
    onEdit: (data: PromoTypes.Service.PromoData) => void;
}

export function PromoTableRowActions({ row, onEdit }: Props) {
    const { mutate: pushNotify, isPending } = usePushPromo();
    const data = row.original;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Aksi Promo</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => pushNotify(data.id)}
                    disabled={isPending || data.status !== "aktif"}
                >
                    {isPending ? (
                        <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : (
                        <Send size={14} className="mr-2 text-orange-500" />
                    )}
                    <span>Push Notifikasi</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(data)}>
                    <Edit size={14} className="mr-2 text-[#1D6B5A]" />
                    <span>Edit Promo</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                    <Trash2 size={14} className="mr-2" />
                    <span>Hapus</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}