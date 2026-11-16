import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CaseStudies from "@/components/landing/CaseStudies";
import Features from "@/components/landing/Features";
import InteractiveCalculator from "@/components/landing/InteractiveCalculator";
import Pricing from "@/components/landing/Pricing";
import Regulasi from "@/components/landing/Regulasi";
import InteractiveArticles, { type ArticleItem } from "@/components/landing/InteractiveArticles";
import Roadmap from "@/components/landing/Roadmap";
import InteractiveFaq from "@/components/landing/InteractiveFaq";
import { CTA, Footer } from "@/components/landing/CtaFooter";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const revalidate = 60;

export default async function Home() {
  let articleList: ArticleItem[] = [];
  try {
    const rawArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt))
      .limit(9);

    articleList = rawArticles.map((a) => ({
      id: a.id,
      title: a.title,
      author: a.author,
      category: a.category,
      content: a.content,
      publishedAt: a.publishedAt,
      status: a.status,
      views: a.views,
    }));
  } catch (err) {
    console.error("Failed to fetch articles for landing page:", err);
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <CaseStudies />
      <Features />
      <InteractiveCalculator />
      <Pricing />
      <Regulasi />
      <InteractiveArticles initialArticles={articleList} />
      <Roadmap />
      <InteractiveFaq />
      <CTA />
      <Footer />
    </main>
  );
}
