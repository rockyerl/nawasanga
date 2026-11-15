import { createApiError, isApiError } from "@/lib/exception";
import { mockBillings } from "@/lib/mock-data/billing.mock";
import { errServiceHandler } from "@/lib/utils";
import { BillingTypes } from "@/types/features/billing.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let billingsData: BillingTypes.Service.BillingData[] = [...mockBillings];

class MockBillingService {
    async getBillings({
                          page,
                          itemPerPage,
                          sortBy = "paymentDate",
                          direction = QueryDirection.DESC,
                          search = "",
                      }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = billingsData.filter(
                (b) =>
                    b.organizationName.toLowerCase().includes(search.toLowerCase()) ||
                    b.personInCharge.toLowerCase().includes(search.toLowerCase())
            );

            filtered.sort((a, b) => {
                const aVal = String(a[sortBy as keyof typeof a] ?? "");
                const bVal = String(b[sortBy as keyof typeof b] ?? "");
                return direction === QueryDirection.DESC
                    ? bVal.localeCompare(aVal)
                    : aVal.localeCompare(bVal);
            });

            const start = (page - 1) * itemPerPage;
            return {
                code: 200,
                status: "OK",
                message: "Berhasil",
                data: {
                    items: filtered.slice(start, start + itemPerPage),
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

    async deleteBilling(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = billingsData.findIndex((b) => b.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Data billing tidak ditemukan");
            billingsData.splice(index, 1);
            return { code: 200, status: "OK", message: "Billing berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockBillingService();