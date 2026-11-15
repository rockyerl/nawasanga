import { Layout } from "@/components/layouts/layout";
import { PerAssetTable } from "@/features/report-per-asset/components/report-per-asset-table";

export default function PerAssetPage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Laporan Per Asset</h2>
                        <p className="text-sm text-[#8E8E8E]">Detail emisi dan efisiensi berdasarkan masing-masing asset</p>
                    </div>
                </div>
                <PerAssetTable />
            </section>
        </Layout>
    );
}