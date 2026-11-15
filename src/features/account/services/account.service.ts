import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

class AccountService {
  async getAccounts({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        itemPerPage: itemPerPage.toString(),
        sort: sortBy,
        direction,
        search,
      });

      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/accounts?${queryParams.toString()}`
      );

      if ((res.data as HttpClientTypes.Response<unknown>).code >= 400) {
        throw createApiError(
          (res.data as HttpClientTypes.Response<unknown>).code,
          (res.data as HttpClientTypes.Response<unknown>).status || "Error",
          (res.data as HttpClientTypes.Response<unknown>).message || "Request failed"
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async createAccount(payload: unknown) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/accounts",
        payload
      );

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateAccount(id: string, payload: unknown) {
    return { code: 200, status: "OK", message: "Akun berhasil diperbarui" };
  }

  async deleteAccount(id: string) {
    try {
      const res = await Client.del<HttpClientTypes.Response<unknown>, unknown>(
        `internal/accounts/${id}`
      );

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }
}

export default new AccountService();
