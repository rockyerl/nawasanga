"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { mockRoles } from "@/lib/mock-data/users.mock";
import { useCreateUserPage } from "../hooks/use-users-queries";

interface UserFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: any;
}

export function UserFormDialog({ open, setOpen, initialData }: UserFormDialogProps) {
    const createMutation = useCreateUserPage();
    const [name, setName]   = useState(initialData?.name  ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [role, setRole]   = useState(initialData?.role  ?? "");

    const isEdit = !!initialData;
    const canSave = name.trim() && email.trim() && role;

    const handleSave = () => {
        if (!canSave) return;
        const payload = { name, email, role, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastLoginAt: null, memberId: null, dpcId: null };
        createMutation.mutate(payload, {
            onSuccess: () => {
                setOpen(false);
                setName(""); setEmail(""); setRole("");
            },
        });
    };

    const inputStyle = {
        width: "100%",
        height: "38px",
        borderRadius: "8px",
        border: "1.5px solid #DEDAD0",
        padding: "0 12px",
        fontSize: "14px",
        color: "#1A1A18",
        backgroundColor: "#FFFFFF",
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "border-color 0.15s",
    };

    const labelStyle = {
        display: "block",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        color: "#7A7A72",
        marginBottom: "6px",
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent style={{
                maxWidth: "480px",
                padding: 0,
                overflow: "hidden",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                backgroundColor: "#FFFFFF",
            }}>
                {/* Header */}
                <div style={{
                    padding: "20px 24px 18px",
                    borderBottom: "1px solid #EDEAE0",
                    backgroundColor: "#F7F5EF",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    <div style={{
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: "#eef5f3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <UserPlus size={18} color="#1D6B5A" />
                    </div>
                    <div>
                        <DialogTitle style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A18", margin: 0, lineHeight: 1.3 }}>
                            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
                        </DialogTitle>
                        <p style={{ fontSize: "12px", color: "#7A7A72", margin: "2px 0 0" }}>
                            {isEdit ? "Ubah data pengguna" : "Isi data untuk akun pengguna baru"}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    {/* Nama */}
                    <div>
                        <label style={labelStyle}>Nama Lengkap</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Ahmad Fauzi"
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                            onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>Alamat Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Contoh: ahmad@perusahaan.com"
                            type="email"
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                            onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label style={labelStyle}>Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                ...inputStyle,
                                cursor: "pointer",
                                appearance: "none" as const,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7A72' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 12px center",
                                paddingRight: "36px",
                                color: role ? "#1A1A18" : "#7A7A72",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                            onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                        >
                            <option value="" disabled>Pilih role pengguna</option>
                            {mockRoles.map((r) => (
                                <option key={r.id} value={r.roleName}>{r.roleName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "16px 24px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    borderTop: "1px solid #EDEAE0",
                    backgroundColor: "#F7F5EF",
                }}>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            padding: "0 16px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "1px solid #DEDAD0",
                            backgroundColor: "#FFFFFF",
                            color: "#7A7A72",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F0EDE5"; e.currentTarget.style.color = "#1A1A18"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.color = "#7A7A72"; }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave || createMutation.isPending}
                        style={{
                            padding: "0 20px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: !canSave || createMutation.isPending ? "#a2cfc5" : "#1D6B5A",
                            color: "#F7F5EF",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: !canSave || createMutation.isPending ? "not-allowed" : "pointer",
                            transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => { if (canSave && !createMutation.isPending) e.currentTarget.style.backgroundColor = "#175749"; }}
                        onMouseLeave={(e) => { if (canSave && !createMutation.isPending) e.currentTarget.style.backgroundColor = "#1D6B5A"; }}
                    >
                        {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}