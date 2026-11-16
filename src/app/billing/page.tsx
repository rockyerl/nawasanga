import { Layout } from "@/components/layouts/layout";
import { BillingView } from "@/features/billing/components/billing-table";

export const metadata = {
  title: "Billing & Paket Langganan | Client Portal",
  description: "Informasi tier langganan aktif, kuota armada, dan riwayat faktur.",
};

export default function BillingPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Billing & Langganan Organisasi</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Kelola paket aktif, kuota pemantauan armada, dan unduh faktur pembayaran</p>
          </div>
        </div>
        <BillingView />
      </section>
    </Layout>
  );
}
