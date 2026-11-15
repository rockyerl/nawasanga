import { Layout } from "@/components/layouts/layout";
import { DriverTable } from "@/features/driver/components/driver-table";

export const metadata = {
  title: "Driver & Pengemudi Armada | Client Portal",
  description: "Daftar pengemudi armada logistik dan operasional organisasi.",
};

export default function ClientDriversPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Driver / Pengemudi</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Kelola data pengemudi armada dan lisensi kendaraan</p>
          </div>
        </div>
        <DriverTable />
      </section>
    </Layout>
  );
}
