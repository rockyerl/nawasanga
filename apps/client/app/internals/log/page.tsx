"use client";

import { Layout } from "@/components/layouts/layout";
import { LogTable } from "@/features/log/components/log-table";

export default function LogPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Log</h2>
                    <span className="text-sm text-[#29A2A5]">Last Login: 09/03/26 12:45</span>
                </div>
                <LogTable />
            </section>
        </Layout>
    );
}
