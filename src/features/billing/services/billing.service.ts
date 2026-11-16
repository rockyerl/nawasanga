import { createApiError, isApiError } from "@/lib/exception";
import { Client } from "@/lib/http-client";
import { errServiceHandler } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";

export interface GlobalBillingParams {
  search?: string;
  status?: string;
  organizationId?: string;
  page?: number;
  itemPerPage?: number;
}

class BillingService {
  // Global platform billing for Superadmin Backoffice (/internals/billing)
  async getGlobalBilling(params: GlobalBillingParams = {}) {
    try {
      const q = new URLSearchParams({
        type: "global",
        search: params.search || "",
        status: params.status || "all",
        organizationId: params.organizationId || "all",
        page: String(params.page || 1),
        itemPerPage: String(params.itemPerPage || 10),
      });

      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/billing?${q.toString()}`
      );

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Client organization billing for Client Portal (/billing and /dashboard/billing)
  async getBilling(companyName?: string) {
    try {
      const q = new URLSearchParams({ type: "client" });
      if (companyName) q.set("companyName", companyName);
      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/billing?${q.toString()}`
      );

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Issue new invoice
  async createInvoice(payload: {
    organizationId: string;
    amountIdr: number;
    paymentMethod: string;
    status?: string;
  }) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/billing",
        payload
      );
      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Update invoice status (e.g. mark paid)
  async updateInvoiceStatus(id: string, status: string, paymentMethod?: string) {
    try {
      const res = await Client.put<HttpClientTypes.Response<unknown>, unknown>(
        `internal/billing/${id}`,
        { status, paymentMethod }
      );
      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Get single invoice detail
  async getInvoiceDetail(id: string) {
    try {
      const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
        `internal/billing/${id}`
      );
      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }
}

export default new BillingService();
