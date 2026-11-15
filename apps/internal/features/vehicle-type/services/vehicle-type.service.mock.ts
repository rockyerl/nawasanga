import { createApiError, isApiError } from "@/lib/exception";
import { mockVehicleTypes } from "@/lib/mock-data/vehicle-type.mock";
import { errServiceHandler } from "@/lib/utils";
import { VehicleTypeTypes } from "@/types/features/vehicle-type.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let vehicleTypesData: VehicleTypeTypes.Service.VehicleTypeData[] = [...mockVehicleTypes];

class MockVehicleTypeService {

    async getVehicleTypes({
                              page,
                              itemPerPage,
                              sortBy = "name",
                              direction = QueryDirection.ASC,
                              search = "",
                          }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = vehicleTypesData.filter(
                (v) =>
                    v.name.toLowerCase().includes(search.toLowerCase()) ||
                    v.category.toLowerCase().includes(search.toLowerCase()) ||
                    v.description.toLowerCase().includes(search.toLowerCase())
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

    async createVehicleType(
        payload: Omit<VehicleTypeTypes.Service.VehicleTypeData, "id">
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const newItem: VehicleTypeTypes.Service.VehicleTypeData = {
                id: `vt_${Math.random().toString(36).substr(2, 9)}`,
                ...payload,
            };
            vehicleTypesData.unshift(newItem);
            return { code: 201, status: "Created", message: "Tipe kendaraan berhasil dibuat", data: newItem };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async updateVehicleType(
        id: string,
        payload: Partial<VehicleTypeTypes.Service.VehicleTypeData>
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = vehicleTypesData.findIndex((v) => v.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Tipe kendaraan tidak ditemukan");
            vehicleTypesData[index] = { ...vehicleTypesData[index], ...payload };
            return { code: 200, status: "OK", message: "Tipe kendaraan berhasil diperbarui", data: vehicleTypesData[index] };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteVehicleType(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = vehicleTypesData.findIndex((v) => v.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Tipe kendaraan tidak ditemukan");
            vehicleTypesData.splice(index, 1);
            return { code: 200, status: "OK", message: "Tipe kendaraan berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        vehicleTypesData = [...mockVehicleTypes];
    }
}

export default new MockVehicleTypeService();