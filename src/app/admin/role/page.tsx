"use client";

import { Layout } from "@/components/layouts/layout";
import { RoleTable } from "@/features/role/components/role-table";

export default function AdminRolePage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A18]">
              Role &amp; Matriks RBAC
            </h2>
            <p className="text-sm text-[#7A7A72] mt-0.5">
              Kelola peran pengguna dan izin akses granular (RBAC) di seluruh modul sistem.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <RoleTable />
      </section>
    </Layout>
  );
}
