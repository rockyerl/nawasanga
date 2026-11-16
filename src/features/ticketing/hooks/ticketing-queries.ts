import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ticketingService from "@/features/ticketing/services/ticketing.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const ticketingKeys = {
    all: (params: Query.Params) => ["ticketing", "list", params] as const,
};

export function useTickets(params: Query.Params) {
    return useQuery({
        queryKey: ticketingKeys.all(params),
        queryFn: () => ticketingService.getTickets(params),
    });
}

export const useTicketingList = useTickets;

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: unknown) => ticketingService.createTicket(payload),
        onSuccess: (res: HttpClientTypes.Response<unknown>) => {
            queryClient.invalidateQueries({ queryKey: ["ticketing"] });
            toast.success(res.message || "Tiket bantuan berhasil diajukan.");
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
            ticketingService.updateTicket(id, payload),
        onSuccess: (res: HttpClientTypes.Response<unknown>) => {
            queryClient.invalidateQueries({ queryKey: ["ticketing"] });
            toast.success(res.message || "Status tiket berhasil diperbarui.");
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ticketingService.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticketing"] });
            toast.success("Tiket berhasil dihapus.");
        },
        onError: (err) => onQueryError(err),
    });
}
