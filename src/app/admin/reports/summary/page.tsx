import { Layout } from "@/components/layouts/layout";
import { ReportSummaryTable } from "@/features/report-summary/components/report-summary-table";

export const metadata = {
  title: "Ringkasan Emisi Global | Super Admin",
  description: "Laporan ringkasan emisi dan konsumsi BBM agregat platform.",
};

export default function AdminReportSummaryPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Ringkasan Emisi Global
            </h2>
            <p className="text-sm text-[#7A7A72]">
              Ringkasan komprehensif emisi Scope 1 dan konsumsi bahan bakar agregat seluruh tenant.
            </p>
          </div>
        </div>
        <ReportSummaryTable />
      </section>
    </Layout>
  );
}
