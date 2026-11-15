import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ticketingService from "@/features/ticketing/services/ticketing.service";
import { Query } from "@/types/lib/query.type";

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

export function useDeleteTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ticketingService.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticketing"] });
        },
    });
}