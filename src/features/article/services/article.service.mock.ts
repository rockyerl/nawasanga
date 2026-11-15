import { createApiError, isApiError } from "@/lib/exception";
import { mockArticles } from "@/lib/mock-data/article.mock";
import { errServiceHandler } from "@/lib/utils";
import { ArticleTypes } from "@/types/features/article.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let articlesData: ArticleTypes.Service.ArticleData[] = [...mockArticles];

class MockArticleService {
    async getArticles({
                          page,
                          itemPerPage,
                          sortBy = "publishedAt",
                          direction = QueryDirection.DESC,
                          search = "",
                      }: Query.Params): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const filtered = articlesData.filter(
                (a) =>
                    a.title.toLowerCase().includes(search.toLowerCase()) ||
                    a.author.toLowerCase().includes(search.toLowerCase())
            );

            filtered.sort((a, b) => {
                const aVal = String(a[sortBy as keyof typeof a] ?? "");
                const bVal = String(b[sortBy as keyof typeof b] ?? "");
                return direction === QueryDirection.DESC
                    ? bVal.localeCompare(aVal)
                    : aVal.localeCompare(bVal);
            });

            const start = (page - 1) * itemPerPage;
            return {
                code: 200,
                status: "OK",
                message: "Berhasil mengambil data artikel",
                data: {
                    items: filtered.slice(start, start + itemPerPage),
                    count: filtered.length,
                    page,
                    itemPerPage,
                    totalPages: Math.ceil(filtered.length / itemPerPage),
                },
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    async deleteArticle(id: string): Promise<HttpClientTypes.Response<unknown>> {
        try {
            await delay(300);
            const index = articlesData.findIndex((a) => a.id === id);
            if (index === -1) throw createApiError(404, "Not Found", "Artikel tidak ditemukan");
            articlesData.splice(index, 1);
            return { code: 200, status: "OK", message: "Artikel berhasil dihapus" };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

export default new MockArticleService();