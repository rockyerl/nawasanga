import { createApiError, isApiError } from "@/lib/exception";
import { mockUsers } from "@/lib/mock-data/users.mock";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let usersData = [...mockUsers];

class MockUsersService {
    async getUsers({
                       page,
                       itemPerPage,
                       sortBy = "createdAt",
                       direction = QueryDirection.DESC,
                       search = "",
                   }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(500);

            const filtered = usersData.filter(
                (user) =>
                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                    user.role.toLowerCase().includes(search.toLowerCase()),
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
                message: "Users berhasil diambil",
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

    async createUser(payload: unknown): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);

            const newUser = {
                id: `U${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                ...(payload as object),
            };

            usersData.unshift(newUser as typeof usersData[0]);

            return {
                code: 201,
                status: "Created",
                message: "User berhasil dibuat",
                data: newUser,
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteUser(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);

            const index = usersData.findIndex((u) => u.id === id);
            if (index === -1) {
                throw createApiError(404, "Not Found", "User tidak ditemukan");
            }

            usersData.splice(index, 1);

            return {
                code: 200,
                status: "OK",
                message: "User berhasil dihapus",
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        usersData = [...mockUsers];
    }
}

export default new MockUsersService();