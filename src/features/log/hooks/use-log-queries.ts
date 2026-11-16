import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LogService from "@/features/log/services/log.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const logKeys = {
  list: (params: Query.Params) => ["logs", "list", params] as const,
};

export function useLogs(params: Query.Params) {
  return useQuery({
    queryKey: logKeys.list(params),
    queryFn: () => LogService.getLogs(params),
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: unknown) => LogService.createLog(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      LogService.updateLog(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LogService.deleteLog(id),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
