import { Layout } from "@/components/layouts/layout";
import { ReportAuditTable } from "@/features/report-audit/components/report-audit-table";

export const metadata = {
  title: "Audit Emisi Scope 1 Global | Super Admin",
  description: "Log jejak audit integritas perhitungan emisi gas rumah kaca Scope 1.",
};

export default function AdminReportAuditPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Audit Emisi Scope 1 Global
            </h2>
            <p className="text-sm text-[#7A7A72]">
              Jejak audit kepatuhan metodologi IPCC, validasi bukti transaksi BBM, dan kesiapan verifikasi pihak ketiga.
            </p>
          </div>
        </div>
        <ReportAuditTable />
      </section>
    </Layout>
  );
}
