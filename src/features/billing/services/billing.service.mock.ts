import { isApiError } from "@/lib/exception";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { mockBilling } from "@/lib/mock-data/billing.mock";
import type { BillingTypes } from "@/types/features/billing.type";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

class MockBillingService {
    async getBilling(
        companyName: string
    ): Promise<HttpClientTypes.Response<BillingTypes.Service.BillingInfo>> {
        try {
            await delay(400);
            const data = mockBilling[companyName] ?? mockBilling["CV Langit Biru"];
            return {
                code: 200,
                status: "OK",
                message: "Billing berhasil diambil",
                data,
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockBillingService();