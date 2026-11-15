import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";
import type { PlanType } from "@/types/features/report-summary.type";

class ReportSummaryService {
  async getReports(
    plan: PlanType,
    {
      page,
      itemPerPage,
      sortBy = "createdAt",
      direction = QueryDirection.DESC,
      search = "",
    }: Query.Params
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      const queryParams = new URLSearchParams({
        plan,
        page: page.toString(),
        itemPerPage: itemPerPage.toString(),
        sort: sortBy,
        direction,
        search,
      });

      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/reports/summary?${queryParams.toString()}`
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

export default new ReportSummaryService();
