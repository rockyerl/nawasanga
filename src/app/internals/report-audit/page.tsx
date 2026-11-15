import { Layout } from "@/components/layouts/layout";
import { ReportAuditTable } from "@/features/report-audit/components/report-audit-table";

export default function ReportAuditPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Insight / Custom (Audit & Compliance)</h2>
                </div>
                <ReportAuditTable />
            </section>
        </Layout>
    );
}