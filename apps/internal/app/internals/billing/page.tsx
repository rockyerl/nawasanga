"use client";

import { Layout } from "@/components/layouts/layout";
import { BillingTable } from "@/features/billing/components/billing-table";

export default function BillingPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                        Billing
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                        Kelola riwayat pembayaran dan status langganan organisasi.
                    </p>
                </div>
                <BillingTable />
            </section>
        </Layout>
    );
}