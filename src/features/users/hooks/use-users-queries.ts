import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UsersService from "@/features/users/services/users.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const usersKeys = {
    list: (params: Query.Params) => ["users-page", "list", params] as const,
};

export function useUsersPage(params: Query.Params) {
    return useQuery({
        queryKey: usersKeys.list(params),
        queryFn: () => UsersService.getUsers(params),
    });
}

export const useUsers = useUsersPage;

export function useCreateUserPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: unknown) => UsersService.createUser(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: usersKeys.list({ page: 1, itemPerPage: 10 }),
            });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteUserPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => UsersService.deleteUser(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: usersKeys.list({ page: 1, itemPerPage: 10 }),
            });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}