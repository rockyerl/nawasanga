import { Layout } from "@/components/layouts/layout";
import { ReportSummaryTable } from "@/features/report-summary/components/report-summary-table";

export default function ReportSummaryPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Laporan Ringkasan</h2>
                        <p className="text-sm text-[#8E8E8E]">Ringkasan emisi dan konsumsi BBM perusahaan Anda</p>
                    </div>
                </div>
                <ReportSummaryTable />
            </section>
        </Layout>
    );
}