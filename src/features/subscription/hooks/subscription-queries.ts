import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import subscriptionService from "@/features/subscription/services/subscription.service.mock";
import { onQueryError } from "@/lib/utils";
import { SubscriptionTypes } from "@/types/features/subscription.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";

export const subscriptionKeys = {
    all: () => ["subscription", "plans"] as const,
};

export function usePlans() {
    return useQuery({
        queryKey: subscriptionKeys.all(),
        queryFn:  () => subscriptionService.getPlans(),
    });
}

export function useUpdatePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: string;
            payload: SubscriptionTypes.Service.UpdatePlanRequest;
        }) => subscriptionService.updatePlan(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: subscriptionKeys.all() });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}