import { Layout } from "@/components/layouts/layout";
import { ReportSummaryTable } from "@/features/report-summary/components/report-summary-table";

export const metadata = {
  title: "Ringkasan Emisi Karbon | Client Portal",
  description: "Laporan ringkasan emisi bulanan dan total konsumsi bahan bakar armada.",
};

export default function ReportSummaryPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Ringkasan Emisi</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Agregasi jejak karbon bulanan organisasi Anda</p>
          </div>
        </div>
        <ReportSummaryTable />
      </section>
    </Layout>
  );
}
