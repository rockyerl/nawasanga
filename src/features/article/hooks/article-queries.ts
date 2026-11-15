import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import articleService from "@/features/article/services/article.service";
import { Query } from "@/types/lib/query.type";

export const articleKeys = {
    all: (params: Query.Params) => ["article", "list", params] as const,
};

export function useArticles(params: Query.Params) {
    return useQuery({
        queryKey: articleKeys.all(params),
        queryFn: () => articleService.getArticles(params),
    });
}

export function useDeleteArticle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => articleService.deleteArticle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["article"] });
        },
    });
}