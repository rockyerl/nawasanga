"use client";

import { Layout } from "@/components/layouts/layout";
import { FuelTypeTable } from "@/features/fuel-type/components/fuel-type-table";

export default function FuelTypePage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                            Bahan Bakar
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                            Kelola jenis bahan bakar, faktor emisi, dan harga referensi.
                        </p>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#1D6B5A" }}>
                        Last Login: 09/03/26 12:45
                    </span>
                </div>
                <FuelTypeTable />
            </section>
        </Layout>
    );
}