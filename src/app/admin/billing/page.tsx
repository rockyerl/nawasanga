import { Layout } from "@/components/layouts/layout";
import { GlobalBillingView } from "@/features/billing/components/global-billing-view";

export const metadata = {
  title: "Faktur & Billing Global | Super Admin Backoffice",
  description: "Kelola penerbitan faktur tagihan langganan seluruh organisasi klien dan pantau pendapatan platform.",
};

export default function AdminBillingPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Faktur &amp; Billing Global
            </h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">
              Kelola penerbitan faktur resmi, status pelunasan seluruh tenant, dan pantau arus pendapatan platform.
            </p>
          </div>
        </div>
        <GlobalBillingView />
      </section>
    </Layout>
  );
}
