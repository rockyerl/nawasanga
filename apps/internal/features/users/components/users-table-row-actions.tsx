"use client";

import type { Row } from "@tanstack/table-core";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserFormDialog } from "./users-form-dialog";

interface UsersTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function UsersTableRowActions<TData>({ row }: UsersTableRowActionsProps<TData>) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        style={{
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #EDEAE0",
                            borderRadius: "6px",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#7A7A72",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F7F5EF"; e.currentTarget.style.borderColor = "#DEDAD0"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#EDEAE0"; }}
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{
                    minWidth: "160px",
                    border: "1px solid #EDEAE0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    backgroundColor: "#FFFFFF",
                    padding: "4px",
                }}>
                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", fontSize: "13px", color: "#1A1A18", cursor: "pointer" }}
                    >
                        <Pencil size={13} color="#1D6B5A" />
                        Edit Pengguna
                    </DropdownMenuItem>
                    <DropdownMenuItem style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", fontSize: "13px", color: "#C14B2A", cursor: "pointer" }}>
                        <Trash2 size={13} />
                        Hapus Pengguna
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserFormDialog open={editOpen} setOpen={setEditOpen} initialData={row.original} />
        </>
    );
}