import { Layout } from "@/components/layouts/layout";
import { TicketingTable } from "@/features/ticketing/components/ticketing-table";

export const metadata = {
  title: "Pusat Bantuan & Tiket Dukungan | Client Portal",
  description: "Kirim pertanyaan teknis telematika, kendala transaksi, atau permintaan integrasi.",
};

export default function ClientSupportPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Pusat Bantuan & Tiket Layanan</h2>
            <p className="text-xs text-[#7A7A72] mt-0.5">Ajukan permohonan dukungan teknis telematika armada ke tim Sundawa</p>
          </div>
        </div>
        <TicketingTable />
      </section>
    </Layout>
  );
}
