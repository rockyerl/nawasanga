"use client";

import { Layout } from "@/components/layouts/layout";
import { FuelTypeTable } from "@/features/fuel-type/components/fuel-type-table";

export default function AdminFuelTypePage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
              Faktor Emisi BBM (IPCC)
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
              Kelola master jenis bahan bakar, koefisien faktor emisi Scope 1 (IPCC Guideline), dan harga referensi resmi.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <FuelTypeTable />
      </section>
    </Layout>
  );
}
