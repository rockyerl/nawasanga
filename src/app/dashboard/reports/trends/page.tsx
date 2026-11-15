import { Layout } from "@/components/layouts/layout";
import { ReportTrenTable } from "@/features/report-tren/components/report-tren-table";

export const metadata = {
  title: "Tren Emisi & Konsumsi BBM | Client Portal",
  description: "Grafik tren historis emisi dan analisis rekomendasi penghematan.",
};

export default function ClientReportTrendsPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Tren Emisi & Konsumsi BBM</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Analisis komparasi periode dan deteksi anomali konsumsi bahan bakar</p>
          </div>
        </div>
        <ReportTrenTable />
      </section>
    </Layout>
  );
}
