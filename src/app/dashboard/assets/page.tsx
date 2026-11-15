import { Layout } from "@/components/layouts/layout";
import { OperationalTable } from "@/features/operational/components/operational-table";

export const metadata = {
  title: "Aset Kendaraan & Alat Berat | Client Portal",
  description: "Manajemen armada kendaraan operasional dan genset organisasi.",
};

export default function ClientAssetsPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Aset Kendaraan & Alat Berat</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Daftar armada aktif dan inventaris aset emisi organisasi Anda</p>
          </div>
        </div>
        <OperationalTable />
      </section>
    </Layout>
  );
}
