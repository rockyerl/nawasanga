import { Layout } from "@/components/layouts/layout";
import { ReportAuditTable } from "@/features/report-audit/components/report-audit-table";

export const metadata = {
  title: "Audit Emisi Scope 1 & Kepatuhan | Client Portal",
  description: "Dokumen audit kepatuhan ESG, faktor emisi IPCC, dan sertifikasi emisi.",
};

export default function ReportAuditPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Audit Emisi Scope 1</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Verifikasi audit kepatuhan emisi langsung dan pelaporan ESG resmi</p>
          </div>
        </div>
        <ReportAuditTable />
      </section>
    </Layout>
  );
}
