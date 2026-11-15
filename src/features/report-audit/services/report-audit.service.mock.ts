import { isApiError } from "@/lib/exception";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { mockAudit } from "@/lib/mock-data/report-audit.mock";
import { type PlanType, type AuditTypes } from "@/types/features/report-audit.type";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

class MockAuditService {
    async getInsights(
        plan: PlanType
    ): Promise<HttpClientTypes.Response<AuditTypes.Service.AuditData>> {
        try {
            await delay(500);
            return {
                code: 200,
                status: "OK",
                message: "Data audit berhasil diambil",
                data: mockAudit[plan],
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockAuditService();