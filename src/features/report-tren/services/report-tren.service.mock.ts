import { isApiError } from "@/lib/exception";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { mockTrends } from "@/lib/mock-data/report-tren.mock";
import { type PlanType, type TrendTypes } from "@/types/features/report-tren.type";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

class MockTrendService {
    async getTrends(
        plan: PlanType
    ): Promise<HttpClientTypes.Response<TrendTypes.Service.TrendData>> {
        try {
            await delay(500);
            return {
                code: 200,
                status: "OK",
                message: "Trend berhasil diambil",
                data: mockTrends[plan],
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockTrendService();