import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LocationService from "@/features/location/services/location.service.mock";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const locationKeys = {
  list: (params: Query.Params) => ["locations", "list", params] as const,
};

export function useLocations(params: Query.Params) {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => LocationService.getLocations(params),
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: unknown) => LocationService.createLocation(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: locationKeys.list({ page: 1, itemPerPage: 10 }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      LocationService.updateLocation(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: locationKeys.list({ page: 1, itemPerPage: 10 }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LocationService.deleteLocation(id),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: locationKeys.list({ page: 1, itemPerPage: 10 }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
