import { createApiError, isApiError } from "@/lib/exception";
import { mockLocations } from "@/lib/mock-data/location.mock";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let locationsData = [...mockLocations];

class MockLocationService {
  async getLocations({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(500);

      const filtered = locationsData.filter(
        (loc) =>
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.city.toLowerCase().includes(search.toLowerCase()) ||
          loc.province.toLowerCase().includes(search.toLowerCase()),
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
        message: "Location berhasil diambil",
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

  async createLocation(payload: unknown): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const newLocation = {
        id: `loc_${Math.random().toString(36).substr(2, 9)}`,
        ...(payload as object),
      };

      locationsData.unshift(newLocation as typeof locationsData[0]);

      return {
        code: 201,
        status: "Created",
        message: "Location berhasil dibuat",
        data: newLocation,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateLocation(id: string, payload: unknown): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = locationsData.findIndex((l) => l.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Location tidak ditemukan");
      }

      locationsData[index] = { ...locationsData[index], ...(payload as object) };

      return {
        code: 200,
        status: "OK",
        message: "Location berhasil diperbarui",
        data: locationsData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteLocation(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = locationsData.findIndex((l) => l.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Location tidak ditemukan");
      }

      locationsData.splice(index, 1);

      return {
        code: 200,
        status: "OK",
        message: "Location berhasil dihapus",
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  resetData() {
    locationsData = [...mockLocations];
  }
}

export default new MockLocationService();
