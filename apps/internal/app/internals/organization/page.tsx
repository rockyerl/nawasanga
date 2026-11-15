"use client";

import { Layout } from "@/components/layouts/layout";
import { OrganizationTable } from "@/features/organization/components/organization-table";

export default function OrganizationPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                            Organisasi
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                            Kelola tenant organisasi, subscription plan, dan batas aset.
                        </p>
                    </div>
                    <span className="text-sm" style={{ color: "#29A2A5" }}>
                        Last Login: 09/03/26 12:45
                    </span>
                </div>
                <OrganizationTable />
            </section>
        </Layout>
    );
}