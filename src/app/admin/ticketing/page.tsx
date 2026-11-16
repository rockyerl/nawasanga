"use client";

import { Layout } from "@/components/layouts/layout";
import { TicketingTable } from "@/features/ticketing/components/ticketing-table";

export default function AdminTicketingPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
              Helpdesk &amp; Tiket Global
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
              Pusat penanganan kendala teknis, tiket permohonan audit, dan respon dukungan customer.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <TicketingTable />
      </section>
    </Layout>
  );
}
