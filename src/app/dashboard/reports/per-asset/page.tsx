import { Layout } from "@/components/layouts/layout";
import { PerAssetTable } from "@/features/report-per-asset/components/report-per-asset-table";

export const metadata = {
  title: "Laporan Emisi per Aset Armada | Client Portal",
  description: "Peringkat emisi dan efisiensi konsumsi BBM per unit kendaraan.",
};

export default function ClientReportPerAssetPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Laporan Emisi per Aset</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Analisis intensitas emisi dan efisiensi km/L per armada kendaraan</p>
          </div>
        </div>
        <PerAssetTable />
      </section>
    </Layout>
  );
}
