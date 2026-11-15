export namespace ArticleTypes {
    export namespace Service {
        export type ArticleStatus = "published" | "draft" | "archived";

        export interface ArticleData {
            id: string;
            title: string;
            author: string;
            category: string;
            content: string;
            publishedAt: string;
            status: ArticleStatus;
            views: number;
        }
    }
}