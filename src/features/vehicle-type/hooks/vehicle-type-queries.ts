import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import vehicleTypeService from "@/features/vehicle-type/services/vehicle-type.service.mock";
import { onQueryError } from "@/lib/utils";
import { VehicleTypeTypes } from "@/types/features/vehicle-type.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const vehicleTypeKeys = {
    all:  (params: Query.Params) => ["vehicle-type", "list", params] as const,
};

export function useVehicleTypes(params: Query.Params) {
    return useQuery({
        queryKey: vehicleTypeKeys.all(params),
        queryFn:  () => vehicleTypeService.getVehicleTypes(params),
    });
}

export function useCreateVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<VehicleTypeTypes.Service.VehicleTypeData, "id">) =>
            vehicleTypeService.createVehicleType(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["vehicle-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<VehicleTypeTypes.Service.VehicleTypeData> }) =>
            vehicleTypeService.updateVehicleType(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["vehicle-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => vehicleTypeService.deleteVehicleType(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["vehicle-type"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}