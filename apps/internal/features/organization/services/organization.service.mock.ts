import { createApiError, isApiError } from "@/lib/exception";
import { mockOrganizations } from "@/lib/mock-data/organization.mock";
import { errServiceHandler } from "@/lib/utils";
import { OrganizationTypes } from "@/types/features/organization.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let organizationsData: OrganizationTypes.Service.OrganizationData[] = [...mockOrganizations];

class MockOrganizationService {

    async getOrganizations({
                               page,
                               itemPerPage,
                               sortBy = "name",
                               direction = QueryDirection.ASC,
                               search = "",
                           }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = organizationsData.filter(
                (o) =>
                    o.name.toLowerCase().includes(search.toLowerCase()) ||
                    o.city.toLowerCase().includes(search.toLowerCase()) ||
                    o.industry.toLowerCase().includes(search.toLowerCase()) ||
                    (o.npwp ?? "").toLowerCase().includes(search.toLowerCase())
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

    async createOrganization(
        payload: Omit<OrganizationTypes.Service.OrganizationData, "id" | "createdAt">
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const newItem: OrganizationTypes.Service.OrganizationData = {
                id:        `org_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                ...payload,
            };
            organizationsData.unshift(newItem);
            return { code: 201, status: "Created", message: "Organisasi berhasil dibuat", data: newItem };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async updateOrganization(
        id: string,
        payload: Partial<Omit<OrganizationTypes.Service.OrganizationData, "id" | "createdAt">>
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = organizationsData.findIndex((o) => o.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Organisasi tidak ditemukan");
            organizationsData[index] = { ...organizationsData[index], ...payload };
            return { code: 200, status: "OK", message: "Organisasi berhasil diperbarui", data: organizationsData[index] };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteOrganization(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = organizationsData.findIndex((o) => o.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Organisasi tidak ditemukan");
            organizationsData.splice(index, 1);
            return { code: 200, status: "OK", message: "Organisasi berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        organizationsData = [...mockOrganizations];
    }
}

export default new MockOrganizationService();