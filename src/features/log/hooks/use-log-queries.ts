import { useQuery } from "@tanstack/react-query";
import LogService from "@/features/log/services/log.service";
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
