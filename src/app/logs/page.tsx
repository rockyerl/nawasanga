import { Layout } from "@/components/layouts/layout";
import { LogTable } from "@/features/log/components/log-table";

export const metadata = {
  title: "Pencatatan BBM & Transaksi Emisi | Client Portal",
  description: "Log pengisian bahan bakar armada, odometer, dan perhitungan emisi GRK.",
};

export default function LogsPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Pencatatan Konsumsi BBM</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Riwayat transaksi pengisian BBM dan perhitungan emisi CO₂ real-time</p>
          </div>
        </div>
        <LogTable />
      </section>
    </Layout>
  );
}
