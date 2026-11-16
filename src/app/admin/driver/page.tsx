"use client";

import { Layout } from "@/components/layouts/layout";
import { DriverTable } from "@/features/driver/components/driver-table";

export default function AdminDriverPage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Driver / Pengemudi Global
            </h2>
            <p className="text-sm text-[#7A7A72] mt-0.5">
              Tinjau database pengemudi terdaftar lintas seluruh tenant platform.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <DriverTable />
      </section>
    </Layout>
  );
}
