import { Layout } from "@/components/layouts/layout";
import { ReportAuditTable } from "@/features/report-audit/components/report-audit-table";

export const metadata = {
  title: "Audit Emisi Karbon Scope 1 | Client Portal",
  description: "Dokumentasi audit kepatuhan ESG dan metodologi perhitungan standar IPCC 2006.",
};

export default function ClientReportAuditPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Audit Emisi Karbon ESG</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Sertifikasi perhitungan GRK Scope 1 berbasis standar IPCC & ISO 14064-1</p>
          </div>
        </div>
        <ReportAuditTable />
      </section>
    </Layout>
  );
}
