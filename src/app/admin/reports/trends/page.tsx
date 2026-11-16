import { Layout } from "@/components/layouts/layout";
import { ReportTrenTable } from "@/features/report-tren/components/report-tren-table";

export const metadata = {
  title: "Tren Konsumsi & Emisi Global | Super Admin",
  description: "Analisis tren konsumsi bahan bakar dan proyeksi dekarbonisasi agregat.",
};

export default function AdminReportTrendPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Tren Konsumsi &amp; Emisi Global
            </h2>
            <p className="text-sm text-[#7A7A72]">
              Tren historis bulanan dan proyeksi dekarbonisasi lintas seluruh operasional platform.
            </p>
          </div>
        </div>
        <ReportTrenTable />
      </section>
    </Layout>
  );
}
