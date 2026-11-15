import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { PlanType, AuditTypes } from "@/types/features/report-audit.type";

class ReportAuditService {
  async getInsights(
    plan: PlanType
  ): Promise<HttpClientTypes.Response<AuditTypes.Service.AuditData>> {
    try {
      const res = await Client.get<
        HttpClientTypes.Response<AuditTypes.Service.AuditData>,
        unknown
      >(`internal/reports/audit?plan=${plan}`);

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

export default new ReportAuditService();
