import { createApiError, isApiError } from "@/lib/exception";
import { mockFuelTypes } from "@/lib/mock-data/fuel-type.mock";
import { errServiceHandler } from "@/lib/utils";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let fuelTypesData: FuelTypeTypes.Service.FuelTypeData[] = [...mockFuelTypes];

class MockFuelTypeService {

    async getFuelTypes({
                           page,
                           itemPerPage,
                           sortBy = "name",
                           direction = QueryDirection.ASC,
                           search = "",
                       }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = fuelTypesData.filter(
                (f) =>
                    f.name.toLowerCase().includes(search.toLowerCase()) ||
                    f.code.toLowerCase().includes(search.toLowerCase()) ||
                    f.source.toLowerCase().includes(search.toLowerCase())
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

    async createFuelType(
        payload: Omit<FuelTypeTypes.Service.FuelTypeData, "id" | "updatedAt">
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const newItem: FuelTypeTypes.Service.FuelTypeData = {
                id:        `ft_${Math.random().toString(36).substr(2, 9)}`,
                updatedAt: new Date().toISOString(),
                ...payload,
            };
            fuelTypesData.unshift(newItem);
            return { code: 201, status: "Created", message: "Bahan bakar berhasil dibuat", data: newItem };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async updateFuelType(
        id: string,
        payload: Partial<Omit<FuelTypeTypes.Service.FuelTypeData, "id">>
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = fuelTypesData.findIndex((f) => f.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Bahan bakar tidak ditemukan");
            fuelTypesData[index] = {
                ...fuelTypesData[index],
                ...payload,
                updatedAt: new Date().toISOString(),
            };
            return { code: 200, status: "OK", message: "Bahan bakar berhasil diperbarui", data: fuelTypesData[index] };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteFuelType(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = fuelTypesData.findIndex((f) => f.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Bahan bakar tidak ditemukan");
            fuelTypesData.splice(index, 1);
            return { code: 200, status: "OK", message: "Bahan bakar berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        fuelTypesData = [...mockFuelTypes];
    }
}

export default new MockFuelTypeService();