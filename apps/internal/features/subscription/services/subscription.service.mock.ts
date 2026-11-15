import { isApiError, createApiError } from "@/lib/exception";
import { mockPlans } from "@/lib/mock-data/subscription.mock";
import { errServiceHandler } from "@/lib/utils";
import { SubscriptionTypes } from "@/types/features/subscription.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let plansData: SubscriptionTypes.Service.PlanData[] = [...mockPlans];

class MockSubscriptionService {
    async getPlans(): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            return {
                code:    200,
                status:  "OK",
                message: "Berhasil",
                data:    plansData,
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async updatePlan(
        id: string,
        payload: SubscriptionTypes.Service.UpdatePlanRequest
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = plansData.findIndex((p) => p.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Plan tidak ditemukan");
            plansData[index] = {
                ...plansData[index],
                ...payload,
                updatedAt: new Date().toISOString(),
            };
            return {
                code:    200,
                status:  "OK",
                message: "Plan berhasil diperbarui",
                data:    plansData[index],
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        plansData = [...mockPlans];
    }
}

export default new MockSubscriptionService();