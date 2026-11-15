import { createApiError, isApiError } from "@/lib/exception";
import { mockTickets } from "@/lib/mock-data/ticketing.mock";
import { errServiceHandler } from "@/lib/utils";
import { TicketingTypes } from "@/types/features/ticketing.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let ticketsData: TicketingTypes.Service.TicketData[] = [...mockTickets];

class MockTicketingService {
    async getTickets({
                         page,
                         itemPerPage,
                         sortBy = "createdAt",
                         direction = QueryDirection.DESC,
                         search = "",
                     }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = ticketsData.filter(
                (t) =>
                    t.organizationName.toLowerCase().includes(search.toLowerCase()) ||
                    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
                    t.reportType.toLowerCase().includes(search.toLowerCase())
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

    async deleteTicket(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = ticketsData.findIndex((t) => t.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Tiket tidak ditemukan");
            ticketsData.splice(index, 1);
            return { code: 200, status: "OK", message: "Tiket berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockTicketingService();