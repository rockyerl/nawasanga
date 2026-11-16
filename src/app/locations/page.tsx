import { Layout } from "@/components/layouts/layout";
import { LocationTable } from "@/features/location/components/location-table";

export const metadata = {
  title: "Pool & Lokasi Operasional | Client Portal",
  description: "Daftar pool, depot logistik, dan cabang operasional organisasi.",
};

export default function LocationsPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Lokasi & Pool Armada</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Titik pangkalan pool, depot pengisian BBM, dan site operasional</p>
          </div>
        </div>
        <LocationTable />
      </section>
    </Layout>
  );
}
