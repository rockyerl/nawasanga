"use client";

import { Layout } from "@/components/layouts/layout";
import { ArticleTable } from "@/features/article/components/article-table";

export default function ArticlePage() {
    return (
        <Layout>
            <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
                        Manajemen Artikel
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
                        Kelola publikasi konten, edukasi, dan berita organisasi.
                    </p>
                </div>
                <ArticleTable />
            </section>
        </Layout>
    );
}