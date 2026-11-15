import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import fuelTypeService from "@/features/fuel-type/services/fuel-type.service";
import { onQueryError } from "@/lib/utils";
import { FuelTypeTypes } from "@/types/features/fuel-type.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const fuelTypeKeys = {
    all: (params: Query.Params) => ["fuel-type", "list", params] as const,
};

export function useFuelTypes(params: Query.Params) {
    return useQuery({
        queryKey: fuelTypeKeys.all(params),
        queryFn:  () => fuelTypeService.getFuelTypes(params),
    });
}

export function useCreateFuelType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<FuelTypeTypes.Service.FuelTypeData, "id" | "updatedAt">) =>
            fuelTypeService.createFuelType(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["fuel-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateFuelType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<FuelTypeTypes.Service.FuelTypeData, "id">> }) =>
            fuelTypeService.updateFuelType(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["fuel-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteFuelType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fuelTypeService.deleteFuelType(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["fuel-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}