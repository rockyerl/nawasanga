"use client";

import { Layout } from "@/components/layouts/layout";
import { MonitoringTable } from "@/features/monitoring/components/monitoring-table";

export default function MonitoringPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                        Data Monitoring
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                        Snapshot data real-time dan sinkronisasi data antar organisasi.
                    </p>
                </div>
                <MonitoringTable />
            </section>
        </Layout>
    );
}