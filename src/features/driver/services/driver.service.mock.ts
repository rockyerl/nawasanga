import { createApiError, isApiError } from "@/lib/exception";
import { mockDrivers } from "@/lib/mock-data/driver.mock";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let driversData = [...mockDrivers];

class MockDriverService {
    async getDrivers({
                         page,
                         itemPerPage,
                         sortBy = "name",
                         direction = QueryDirection.ASC,
                         search = "",
                     }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(500);

            const filtered = driversData.filter(
                (d) =>
                    d.name.toLowerCase().includes(search.toLowerCase()) ||
                    d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
                    d.locationName.toLowerCase().includes(search.toLowerCase()),
            );

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
                message: "Driver berhasil diambil",
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

    async createDriver(payload: unknown): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);

            const newDriver = {
                id: `D${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
                employeeId: `EMP-${new Date().getFullYear().toString().slice(2)}${Math.floor(100 + Math.random() * 900)}`,
                ...(payload as object),
            };

            driversData.unshift(newDriver as typeof driversData[0]);

            return {
                code: 201,
                status: "Created",
                message: "Driver berhasil ditambahkan",
                data: newDriver,
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteDriver(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);

            const index = driversData.findIndex((d) => d.id === id);
            if (index === -1) {
                throw createApiError(404, "Not Found", "Driver tidak ditemukan");
            }

            driversData.splice(index, 1);

            return {
                code: 200,
                status: "OK",
                message: "Driver berhasil dihapus",
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        driversData = [...mockDrivers];
    }
}

export default new MockDriverService();