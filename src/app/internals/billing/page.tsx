import { Layout } from "@/components/layouts/layout";
import { BillingView } from "@/features/billing/components/billing-table";

export default function BillingPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Paket & Tagihan</h2>
                </div>
                <BillingView />
            </section>
        </Layout>
    );
}