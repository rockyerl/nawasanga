import { isApiError } from "@/lib/exception";
import { mockAssets, type PlanType } from "@/lib/mock-data/report-per-asset.mock";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockAssetService {
    async getAssets(
        plan: PlanType,
        {
            page,
            itemPerPage,
            sortBy = "rank",
            direction = QueryDirection.ASC,
            search = "",
        }: Query.Params
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(500);

            const filtered = mockAssets[plan].filter(
                (asset) =>
                    asset.name.toLowerCase().includes(search.toLowerCase()) ||
                    (asset.location ?? "").toLowerCase().includes(search.toLowerCase()),
            );

            filtered.sort((a, b) => {
                const aVal = a[sortBy as keyof typeof a] ?? null;
                const bVal = b[sortBy as keyof typeof b] ?? null;
                if (aVal === null) return 1;
                if (bVal === null) return -1;
                if (direction === QueryDirection.DESC) return aVal > bVal ? -1 : 1;
                return aVal > bVal ? 1 : -1;
            });

            const start = (page - 1) * itemPerPage;
            const items = filtered.slice(start, start + itemPerPage);

            return {
                code: 200,
                status: "OK",
                message: "Asset berhasil diambil",
                data: {
                    items,
                    count: filtered.length,
                    page,
                    itemPerPage,
                    totalPages: Math.ceil(filtered.length / itemPerPage),
                },
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockAssetService();