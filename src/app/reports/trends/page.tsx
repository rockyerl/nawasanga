import { Layout } from "@/components/layouts/layout";
import { ReportTrenTable } from "@/features/report-tren/components/report-tren-table";

export const metadata = {
  title: "Tren Konsumsi BBM & Emisi | Client Portal",
  description: "Visualisasi tren konsumsi bahan bakar dan proyeksi dekarbonisasi berkala.",
};

export default function ReportTrendsPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Tren Konsumsi & Emisi</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Analisis histori konsumsi bahan bakar dan proyeksi dekarbonisasi</p>
          </div>
        </div>
        <ReportTrenTable />
      </section>
    </Layout>
  );
}
