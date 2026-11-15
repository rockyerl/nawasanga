import { useQuery } from "@tanstack/react-query";
import DashboardService from "@/features/dashboard/services/dashboard.service";

export const dashboardKeys = {
  stats: (portal: "client" | "internal") => ["dashboard", "stats", portal] as const,
};

export function useDashboardStats(portal: "client" | "internal" = "client") {
  return useQuery({
    queryKey: dashboardKeys.stats(portal),
    queryFn: () => DashboardService.getStats(portal),
  });
}
