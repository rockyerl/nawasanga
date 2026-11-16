import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DriverService from "@/features/driver/services/driver.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const driverKeys = {
    list: (params: Query.Params) => ["driver-page", "list", params] as const,
};

export function useDriverPage(params: Query.Params) {
    return useQuery({
        queryKey: driverKeys.list(params),
        queryFn: () => DriverService.getDrivers(params),
    });
}

export const useDrivers = useDriverPage;

export function useCreateDriver() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: unknown) => DriverService.createDriver(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: driverKeys.list({ page: 1, itemPerPage: 10 }),
            });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateDriver() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
            DriverService.updateDriver(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: driverKeys.list({ page: 1, itemPerPage: 10 }),
            });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteDriver() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => DriverService.deleteDriver(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: driverKeys.list({ page: 1, itemPerPage: 10 }),
            });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}