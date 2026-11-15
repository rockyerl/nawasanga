// app/internals/users/role/page.tsx
"use client";

import { Layout } from "@/components/layouts/layout";
import { RoleTable } from "@/features/role/components/role-table";

export default function RolePage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 p-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-[#1A1A18]">Hak Akses (Role)</h2>
                        <p className="text-sm text-[#7A7A72]">Atur ijin akses menu untuk setiap level jabatan.</p>
                    </div>
                </div>
                <RoleTable />
            </section>
        </Layout>
    );
}