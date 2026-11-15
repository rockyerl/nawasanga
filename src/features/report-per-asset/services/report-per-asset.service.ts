import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";
import type { PlanType } from "@/types/features/report-per-asset.type";

class ReportPerAssetService {
  async getAssets(
    plan: PlanType,
    {
      page,
      itemPerPage,
      sortBy = "rank",
      direction = QueryDirection.ASC,
      search = "",
    }: Query.Params
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      const queryParams = new URLSearchParams({
        plan,
        page: page.toString(),
        itemPerPage: itemPerPage.toString(),
        sortBy,
        direction,
        search,
      });

      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/reports/per-asset?${queryParams.toString()}`
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
}

export default new ReportPerAssetService();
