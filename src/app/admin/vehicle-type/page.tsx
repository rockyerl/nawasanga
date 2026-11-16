"use client";

import { Layout } from "@/components/layouts/layout";
import { VehicleTypeTable } from "@/features/vehicle-type/components/vehicle-type-table";

export default function AdminVehicleTypePage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
              Kategori Kendaraan & Aset
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
              Kelola master klasifikasi armada, benchmark efisiensi bahan bakar, dan profil aset.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <VehicleTypeTable />
      </section>
    </Layout>
  );
}
