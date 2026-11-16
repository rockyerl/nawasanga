import { Layout } from "@/components/layouts/layout";
import { PerAssetTable } from "@/features/report-per-asset/components/report-per-asset-table";

export const metadata = {
  title: "Laporan per Aset Global | Super Admin",
  description: "Laporan efisiensi dan emisi per unit kendaraan lintas organisasi.",
};

export default function AdminReportPerAssetPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Laporan per Aset Global
            </h2>
            <p className="text-sm text-[#7A7A72]">
              Metrik performa spesifik, efisiensi km/L, dan intensitas emisi per unit armada.
            </p>
          </div>
        </div>
        <PerAssetTable />
      </section>
    </Layout>
  );
}
