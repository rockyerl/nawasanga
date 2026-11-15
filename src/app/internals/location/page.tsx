import { Layout } from "@/components/layouts/layout";
import { LocationTable } from "@/features/location/components/location-table";

export default function Page() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Lokasi</h2>
                </div>
                <LocationTable />
            </section>
        </Layout>
    );
}