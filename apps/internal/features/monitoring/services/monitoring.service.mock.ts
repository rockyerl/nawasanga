import { createApiError, isApiError } from "@/lib/exception";
import { mockMonitorings } from "@/lib/mock-data/monitoring.mock";
import { errServiceHandler } from "@/lib/utils";
import { MonitoringTypes } from "@/types/features/monitoring.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let monitoringData: MonitoringTypes.Service.MonitoringData[] = [...mockMonitorings];

class MockMonitoringService {
    async getMonitorings({
                             page,
                             itemPerPage,
                             sortBy = "lastDataSync",
                             direction = QueryDirection.DESC,
                             search = "",
                         }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = monitoringData.filter((m) =>
                m.organizationName.toLowerCase().includes(search.toLowerCase())
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
                message: "Berhasil mengambil data monitoring",
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

    async syncDatabase(): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(1500);
            monitoringData = monitoringData.map(item => ({
                ...item,
                lastDataSync: new Date().toISOString()
            }));
            return {
                code: 200,
                status: "OK",
                message: "Sinkronisasi database berhasil"
            };
        } catch (err) {
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockMonitoringService();