import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";

class DashboardService {
  async getStats(portal: "client" | "internal" = "client"): Promise<HttpClientTypes.Response<any>> {
    try {
      const res = await Client.get<HttpClientTypes.Response<any>, unknown>(
        `internal/dashboard/stats?portal=${portal}`
      );

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

export default new DashboardService();
