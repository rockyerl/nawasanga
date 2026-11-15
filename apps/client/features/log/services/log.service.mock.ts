import { isApiError } from "@/lib/exception";
import { mockLogs } from "@/lib/mock-data/log.mock";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockLogService {
    async getLogs({
                      page,
                      itemPerPage,
                      sortBy = "date",
                      direction = QueryDirection.DESC,
                      search = "",
                      driverId = "",
                      vehicleId = "",
                      assetId = "",
                  }: Query.Params & { driverId?: string; vehicleId?: string; assetId?: string }): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(500);

            const filtered = mockLogs.filter((log) => {
                const matchSearch =
                    !search ||
                    log.id.toLowerCase().includes(search.toLowerCase()) ||
                    log.driverName.toLowerCase().includes(search.toLowerCase()) ||
                    log.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
                    log.assetName.toLowerCase().includes(search.toLowerCase());

                return (
                    matchSearch &&
                    (!driverId || log.driverId === driverId) &&
                    (!vehicleId || log.vehicleId === vehicleId) &&
                    (!assetId || log.assetId === assetId)
                );
            });

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
                message: "Log berhasil diambil",
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

export default new MockLogService();