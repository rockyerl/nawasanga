import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { PlanType, TrendTypes } from "@/types/features/report-tren.type";

class ReportTrendService {
  async getTrends(
    plan: PlanType
  ): Promise<HttpClientTypes.Response<TrendTypes.Service.TrendData>> {
    try {
      const res = await Client.get<
        HttpClientTypes.Response<TrendTypes.Service.TrendData>,
        unknown
      >(`internal/reports/trends?plan=${plan}`);

      if (res.data.code >= 400) {
        throw createApiError(
          res.data.code,
          res.data.status || "Error",
          res.data.message || "Request failed"
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }
}

export default new ReportTrendService();
