"use client";

import { Layout } from "@/components/layouts/layout";
import { TicketingTable } from "@/features/ticketing/components/ticketing-table";

export default function TicketingPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                        Customer Support Ticketing
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                        Kelola laporan bug, kendala layanan, dan pertanyaan dari customer.
                    </p>
                </div>
                <TicketingTable />
            </section>
        </Layout>
    );
}