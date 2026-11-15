import { createApiError, isApiError } from "@/lib/exception";
import { mockAssets } from "@/lib/mock-data/operational.mock";
import { errServiceHandler } from "@/lib/utils";
import { OperationalTypes } from "@/types/features/operational.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let assetsData: OperationalTypes.Service.AssetData[] = [...mockAssets];

class MockOperationalService {
    async getAssets({ page, itemPerPage, sortBy = "name", direction = QueryDirection.ASC, search = "" }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = assetsData.filter((a) =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.type.toLowerCase().includes(search.toLowerCase()) ||
                a.location.toLowerCase().includes(search.toLowerCase())
            );

            filtered.sort((a, b) => {
                const aVal = String(a[sortBy as keyof typeof a] ?? "");
                const bVal = String(b[sortBy as keyof typeof b] ?? "");
                return direction === QueryDirection.DESC ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            });

            const start = (page - 1) * itemPerPage;
            return {
                code: 200,
                status: "OK",
                message: "Berhasil mengambil data aset",
                data: {
                    items: filtered.slice(start, start + itemPerPage),
                    count: filtered.length,
                    page,
                    itemPerPage,
                    totalPages: Math.ceil(filtered.length / itemPerPage)
                }
            };
        } catch (err) { if (isApiError(err)) throw err; throw errServiceHandler(err as Error); }
    }

    async createAsset(payload: Omit<OperationalTypes.Service.AssetData, "id">): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const newItem: OperationalTypes.Service.AssetData = {
                id: `ast_${Math.random().toString(36).substr(2, 9)}`,
                ...payload
            };
            assetsData.unshift(newItem);
            return { code: 201, status: "Created", message: "Asset berhasil dibuat", data: newItem };
        } catch (err) { if (isApiError(err)) throw err; throw errServiceHandler(err as Error); }
    }

    async deleteAsset(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = assetsData.findIndex((a) => a.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Asset tidak ditemukan");
            assetsData.splice(index, 1);
            return { code: 200, status: "OK", message: "Asset berhasil dihapus" };
        } catch (err) { if (isApiError(err)) throw err; throw errServiceHandler(err as Error); }
    }
}

export default new MockOperationalService();