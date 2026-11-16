"use client";

import { Layout } from "@/components/layouts/layout";
import { ArticleTable } from "@/features/article/components/article-table";

export default function AdminArticlePage() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: "#1A1A18" }}>
              Artikel &amp; Regulasi ESG
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#7A7A72" }}>
              Kelola publikasi edukasi dekarbonisasi, panduan regulasi emisi, dan berita untuk landing page.
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "#1D6B5A" }}>
            Admin Control Center
          </span>
        </div>
        <ArticleTable />
      </section>
    </Layout>
  );
}
