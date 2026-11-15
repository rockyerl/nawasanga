import { Layout } from "@/components/layouts/layout";
import { DriverTable } from "@/features/driver/components/driver-table";

export default function Page() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Driver</h2>
                </div>
                <DriverTable />
            </section>
        </Layout>
    );
}