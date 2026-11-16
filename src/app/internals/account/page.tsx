"use client";

import { Layout } from "@/components/layouts/layout";
import { AccountTable } from "@/features/account/components/account-table";

export default function AccountPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                            Akun
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                            Kelola akun organisasi, penanggung jawab, dan subscription.
                        </p>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#1D6B5A" }}>
                        Last Login: 09/03/26 12:45
                    </span>
                </div>
                <AccountTable />
            </section>
        </Layout>
    );
}