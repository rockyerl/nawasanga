"use client";

import { Layout } from "@/components/layouts/layout";
import { UsersTable } from "@/features/users/components/users-table";
import { Users } from "lucide-react";

export default function UserPage() {
    return (
        <Layout>
            <section style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: "24px",
                padding: "24px",
                overflow: "hidden",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #EDEAE0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div>
                            <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#1A1A18", margin: 0, lineHeight: 1.3 }}>
                                User
                            </h2>
                            <p style={{ fontSize: "13px", color: "#7A7A72", margin: "3px 0 0", lineHeight: 1.4 }}>
                                Kelola akun dan hak akses pengguna sistem.
                            </p>
                        </div>
                    </div>
                </div>

                <UsersTable />
            </section>
        </Layout>
    );
}