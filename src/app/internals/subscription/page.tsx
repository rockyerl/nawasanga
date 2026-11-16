"use client";

import { Layout } from "@/components/layouts/layout";
import {SubscriptionTable} from "@/features/subscription/components/subscription-table";
import {JSX} from "react";

export default function SubscriptionPage(): JSX.Element {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                            Master Paket Langganan
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                            Kelola paket langganan, batas aset kendaraan, dan skema harga platform.
                        </p>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#1D6B5A" }}>
                        Last Login: 09/03/26 12:45
                    </span>
                </div>
                <SubscriptionTable />
            </section>
        </Layout>
    );
}