"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { RoleFormDialog } from "./role-form-dialog";

export function RoleTableRowActions({ row }: any) {
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
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F7F5EF";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#DEDAD0";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDEAE0";
                        }}
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    style={{
                        minWidth: "160px",
                        border: "1px solid #EDEAE0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        backgroundColor: "#FFFFFF",
                        padding: "4px",
                    }}
                >
                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "#1A1A18",
                            cursor: "pointer",
                        }}
                    >
                        <Pencil size={13} color="#1D6B5A" />
                        Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "#C14B2A",
                            cursor: "pointer",
                        }}
                    >
                        <Trash2 size={13} />
                        Hapus Role
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <RoleFormDialog open={editOpen} setOpen={setEditOpen} initialData={row.original} />
        </>
    );
}