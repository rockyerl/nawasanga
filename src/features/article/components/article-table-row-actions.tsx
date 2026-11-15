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
import { ArticleTypes } from "@/types/features/article.type";
import { useDeleteArticle } from "../hooks/article-queries";

interface Props {
    row: Row<ArticleTypes.Service.ArticleData>;
    onEdit: (data: ArticleTypes.Service.ArticleData) => void;
}

export function ArticleTableRowActions({ row, onEdit }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { mutate: deleteArticle } = useDeleteArticle();
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
                        <span>Lihat Artikel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(original)}>
                        <Edit size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Edit Konten</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                title="Hapus Artikel"
                description={`Apakah Anda yakin ingin menghapus artikel "${original.title}"?`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() => {
                    deleteArticle(original.id);
                    setDeleteOpen(false);
                }}
            />
        </>
    );
}