import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import organizationService from "@/features/organization/services/organization.service.mock";
import { onQueryError } from "@/lib/utils";
import { OrganizationTypes } from "@/types/features/organization.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const organizationKeys = {
    all: (params: Query.Params) => ["organization", "list", params] as const,
};

export function useOrganizations(params: Query.Params) {
    return useQuery({
        queryKey: organizationKeys.all(params),
        queryFn:  () => organizationService.getOrganizations(params),
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<OrganizationTypes.Service.OrganizationData, "id" | "createdAt">) =>
            organizationService.createOrganization(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["organization"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: string;
            payload: Partial<Omit<OrganizationTypes.Service.OrganizationData, "id" | "createdAt">>;
        }) => organizationService.updateOrganization(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["organization"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => organizationService.deleteOrganization(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["organization"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}