import { Layout } from "@/components/layouts/layout";
import { ReportTrenTable } from "@/features/report-tren/components/report-tren-table";

export default function ReportTrenPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Laporan Tren Emisi</h2>
                </div>
                <ReportTrenTable />
            </section>
        </Layout>
    );
}