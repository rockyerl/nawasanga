import { createApiError, isApiError } from "@/lib/exception";
import { mockAccounts } from "@/lib/mock-data/account.mock";
import { errServiceHandler } from "@/lib/utils";
import { AccountTypes } from "@/types/features/account.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let accountsData: AccountTypes.Service.AccountData[] = [...mockAccounts];

class MockAccountService {
    async getAccounts({
                          page,
                          itemPerPage,
                          sortBy = "organizationName",
                          direction = QueryDirection.ASC,
                          search = "",
                      }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = accountsData.filter(
                (a) =>
                    a.companyName.toLowerCase().includes(search.toLowerCase()) ||
                    a.picName.toLowerCase().includes(search.toLowerCase()) ||
                    a.email.toLowerCase().includes(search.toLowerCase())
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

    async createAccount(
        payload: AccountTypes.Service.CreateAccountRequest
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const newItem: AccountTypes.Service.AccountData = {
                id:        `acc_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                ...payload,
            };
            accountsData.unshift(newItem);
            return { code: 201, status: "Created", message: "Akun berhasil dibuat", data: newItem };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async updateAccount(
        id: string,
        payload: Partial<AccountTypes.Service.CreateAccountRequest>
    ): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = accountsData.findIndex((a) => a.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Akun tidak ditemukan");
            accountsData[index] = { ...accountsData[index], ...payload };
            return { code: 200, status: "OK", message: "Akun berhasil diperbarui", data: accountsData[index] };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteAccount(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = accountsData.findIndex((a) => a.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Akun tidak ditemukan");
            accountsData.splice(index, 1);
            return { code: 200, status: "OK", message: "Akun berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    resetData() {
        accountsData = [...mockAccounts];
    }
}

export default new MockAccountService();