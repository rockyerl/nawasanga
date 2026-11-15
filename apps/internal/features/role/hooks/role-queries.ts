// features/user-management/hooks/role-queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RoleTypes } from "@/types/features/role.type";
import { mockRoles } from "../services/role.service.mock";

export function useRoles() {
    return useQuery({
        queryKey: ["roles", "list"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 500));
            return mockRoles;
        },
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: RoleTypes.Service.UpdateRoleRequest) => {
            await new Promise((r) => setTimeout(r, 500));
            return { message: "Role berhasil dibuat" };
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success(res.message);
        },
    });
}