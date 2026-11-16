"use client";

import type { Row } from "@tanstack/table-core";
import { Trash2, MoreHorizontal, Pencil, ShieldCheck } from "lucide-react";
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
import { useDeleteOrganization } from "@/features/organization/hooks/organization-queries";
import { OrganizationTypes } from "@/types/features/organization.type";
import { OrganizationFormDialog } from "@/features/organization/components/organization-form-dialog";
import { OrganizationKycDialog } from "@/features/organization/components/organization-kyc-dialog";

interface Props {
    row: Row<OrganizationTypes.Service.OrganizationData>;
}

export function OrganizationTableRowActions({ row }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [kycOpen, setKycOpen] = useState(false);
    const deleteOrganization = useDeleteOrganization();
    const original = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[190px]">
                    <DropdownMenuItem onClick={() => setKycOpen(true)} className="cursor-pointer">
                        <ShieldCheck size={14} className="mr-2 text-[#1D6B5A]" />
                        <span>Verifikasi KYC Perusahaan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
                        <Pencil size={14} className="mr-2 text-gray-700" />
                        <span>Edit Data Organisasi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 size={14} className="mr-2 text-red-500" />
                        <span className="text-red-500">Hapus Organisasi</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <OrganizationKycDialog
                open={kycOpen}
                setOpen={setKycOpen}
                organization={original}
            />

            <OrganizationFormDialog
                open={editOpen}
                setOpen={setEditOpen}
                initialData={original}
            />

            <ConfirmDialog
                title="Hapus Organisasi"
                description={`Apakah Anda yakin ingin menghapus "${original.name}"? Tindakan ini tidak dapat dibatalkan.`}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={() =>
                    deleteOrganization.mutate(original.id, {
                        onSuccess: () => setDeleteOpen(false),
                    })
                }
                loading={deleteOrganization.isPending}
            />
        </>
    );
}
