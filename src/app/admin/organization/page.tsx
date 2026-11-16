"use client";

import { Layout } from "@/components/layouts/layout";
import { OrganizationTable } from "@/features/organization/components/organization-table";

export default function AdminOrganizationPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
              Manajemen Organisasi & Tenant
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
              Kelola tenant organisasi klien, status verifikasi legalitas, penetapan paket, dan batas armada.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <OrganizationTable />
      </section>
    </Layout>
  );
}
