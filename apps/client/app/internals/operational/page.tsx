import { OperationalTable } from "@/features/operational/components/operational-table";
import { Layout } from "@/components/layouts/layout";

export default function OperationalPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Operasional Aset</h2>
                </div>
                <OperationalTable />
            </section>
        </Layout>
    );
}