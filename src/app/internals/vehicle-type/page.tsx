"use client";

import { Layout } from "@/components/layouts/layout";
import { VehicleTypeTable } from "@/features/vehicle-type/components/vehicle-type-table";

export default function VehicleTypePage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                            Tipe Kendaraan
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                            Kelola kategori dan tipe kendaraan beserta data emisi.
                        </p>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#1D6B5A" }}>
                        Last Login: 09/03/26 12:45
                    </span>
                </div>
                <VehicleTypeTable />
            </section>
        </Layout>
    );
}