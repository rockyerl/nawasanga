"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, LayoutGrid } from "lucide-react";
import { useCreateRole } from "../hooks/role-queries";

export interface PermissionItem {
    title: string;
    url: string;
    enabled: boolean;
}

const MENU_RESOURCES: Omit<PermissionItem, "enabled">[] = [
    { title: "Beranda", url: "/dashboard" },
    { title: "Organisasi", url: "/internals/organization" },
    { title: "Akun", url: "/internals/account" },
    { title: "Tipe Bahan Bakar", url: "/internals/fuel-type" },
    { title: "Tipe Kendaraan", url: "/internals/vehicle-type" },
    { title: "Manajemen Pengguna", url: "/internals/users" },
    { title: "Pemantauan Data", url: "/internals/monitoring" },
    { title: "Langganan & Tagihan", url: "/internals/subscription" },
    { title: "Dukungan Pelanggan", url: "/internals/support" },
    { title: "Manajemen Artikel", url: "/internals/articles" },
];

export function RoleFormDialog({ open, setOpen, initialData }: any) {
    const createMutation = useCreateRole();
    const [name, setName] = useState("");
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setName(initialData?.name || "");
            const enabled =
                initialData?.permissions
                    ?.filter((p: PermissionItem) => p.enabled)
                    .map((p: PermissionItem) => p.url) || [];
            setSelectedUrls(enabled);
        }
    }, [open, initialData]);

    const toggleUrl = (url: string) => {
        setSelectedUrls((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const handleSave = () => {
        const payload = {
            name,
            permissions: MENU_RESOURCES.map((m) => ({
                ...m,
                enabled: selectedUrls.includes(m.url),
            })),
        };
        createMutation.mutate(payload, {
            onSuccess: () => {
                setOpen(false);
                setName("");
                setSelectedUrls([]);
            },
        });
    };

    const selectedCount = selectedUrls.length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                style={{
                    maxWidth: "580px",
                    padding: 0,
                    overflow: "hidden",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    backgroundColor: "#FFFFFF",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "20px 24px 18px",
                        borderBottom: "1px solid #EDEAE0",
                        backgroundColor: "#F7F5EF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                            style={{
                                padding: "8px",
                                borderRadius: "8px",
                                backgroundColor: "#eef5f3",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ShieldCheck size={18} color="#1D6B5A" />
                        </div>
                        <div>
                            <DialogTitle
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#1A1A18",
                                    margin: 0,
                                    lineHeight: 1.3,
                                }}
                            >
                                {initialData ? "Edit Role" : "Buat Role Baru"}
                            </DialogTitle>
                            <p style={{ fontSize: "12px", color: "#7A7A72", margin: "2px 0 0" }}>
                                {initialData
                                    ? "Ubah nama dan hak akses role ini"
                                    : "Tentukan nama dan izin akses menu"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px" }}>
                    {/* Nama Role */}
                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#7A7A72",
                                marginBottom: "8px",
                            }}
                        >
                            Nama Role
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Admin Operasional"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                border: "1.5px solid #DEDAD0",
                                padding: "10px 12px",
                                fontSize: "14px",
                                color: "#1A1A18",
                                backgroundColor: "#FFFFFF",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.15s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                            onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                        />
                    </div>

                    {/* Akses Menu */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                            }}
                        >
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    color: "#1D6B5A",
                                }}
                            >
                                <LayoutGrid size={13} />
                                Akses Menu
                            </label>
                            {selectedCount > 0 && (
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#175749",
                                        backgroundColor: "#d0e7e2",
                                        padding: "2px 8px",
                                        borderRadius: "9999px",
                                        fontWeight: 500,
                                    }}
                                >
                                    {selectedCount} dipilih
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "4px",
                                border: "1.5px solid #EDEAE0",
                                borderRadius: "10px",
                                padding: "10px",
                                backgroundColor: "#FAFAF8",
                                maxHeight: "280px",
                                overflowY: "auto",
                            }}
                        >
                            {MENU_RESOURCES.map((item) => {
                                const checked = selectedUrls.includes(item.url);
                                return (
                                    <label
                                        key={item.url}
                                        onClick={() => toggleUrl(item.url)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "9px 10px",
                                            borderRadius: "7px",
                                            cursor: "pointer",
                                            backgroundColor: checked ? "#eef5f3" : "transparent",
                                            border: checked ? "1px solid #d0e7e2" : "1px solid transparent",
                                            transition: "all 0.12s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                borderRadius: "4px",
                                                border: checked ? "none" : "1.5px solid #DEDAD0",
                                                backgroundColor: checked ? "#1D6B5A" : "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                transition: "all 0.12s",
                                            }}
                                        >
                                            {checked && (
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path
                                                        d="M1 4L3.5 6.5L9 1"
                                                        stroke="#F7F5EF"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: checked ? 500 : 400,
                                                color: checked ? "#1D6B5A" : "#4A4A42",
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        borderTop: "1px solid #EDEAE0",
                        backgroundColor: "#F7F5EF",
                    }}
                >
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
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "#F0EDE5";
                            (e.target as HTMLButtonElement).style.color = "#1A1A18";
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
                            (e.target as HTMLButtonElement).style.color = "#7A7A72";
                        }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={createMutation.isPending || !name.trim()}
                        style={{
                            padding: "0 20px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor:
                                createMutation.isPending || !name.trim() ? "#a2cfc5" : "#1D6B5A",
                            color: "#F7F5EF",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: createMutation.isPending || !name.trim() ? "not-allowed" : "pointer",
                            transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!createMutation.isPending && name.trim()) {
                                (e.target as HTMLButtonElement).style.backgroundColor = "#175749";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createMutation.isPending && name.trim()) {
                                (e.target as HTMLButtonElement).style.backgroundColor = "#1D6B5A";
                            }
                        }}
                    >
                        {createMutation.isPending ? "Menyimpan..." : "Simpan Role"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}