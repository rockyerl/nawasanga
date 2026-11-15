import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import monitoringService from "@/features/monitoring/services/monitoring.service.mock";
import { Query } from "@/types/lib/query.type";

export const monitoringKeys = {
    all: (params: Query.Params) => ["monitoring", "list", params] as const,
};

export function useMonitorings(params: Query.Params) {
    return useQuery({
        queryKey: monitoringKeys.all(params),
        queryFn: () => monitoringService.getMonitorings(params),
    });
}

export function useSyncMonitoring() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => monitoringService.syncDatabase(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["monitoring"] });
        },
    });
}