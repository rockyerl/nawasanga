import { Layout } from "@/components/layouts/layout";
import { PerAssetTable } from "@/features/report-per-asset/components/report-per-asset-table";

export const metadata = {
  title: "Laporan Emisi per Aset | Client Portal",
  description: "Rincian emisi gas buang dan efisiensi konsumsi BBM per unit armada.",
};

export default function ReportPerAssetPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Laporan Emisi per Aset</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Analisis efisiensi konsumsi BBM dan kontribusi emisi per unit</p>
          </div>
        </div>
        <PerAssetTable />
      </section>
    </Layout>
  );
}
