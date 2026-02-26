import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { allArticlesQuery, allCategoriesQuery, allTagsQuery } from "@/lib/sanity/queries";
import { NewsIndex } from "@/components/headyzine/NewsIndex";
import type { ArticleListResult, Category, Tag } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "HeadyZine - Music News & Stories",
  description:
    "Stories, interviews, and news from the HEADY.FM universe. Discover the latest in indie rock, underground music, and the artists we love.",
  openGraph: {
    title: "HeadyZine - Music News & Stories | HEADY.FM",
    description:
      "Stories, interviews, and news from the HEADY.FM universe.",
    type: "website",
  },
};

const PAGE_SIZE = 9;

export default async function HeadyzinePage() {
  const [result, categories, tags] = await Promise.all([
    sanityFetch<ArticleListResult>({
      query: allArticlesQuery,
      params: { category: "", tag: "", start: 0, end: PAGE_SIZE },
      tags: ["articles"],
    }),
    sanityFetch<Category[]>({
      query: allCategoriesQuery,
      tags: ["categories"],
    }),
    sanityFetch<Tag[]>({
      query: allTagsQuery,
      tags: ["tags"],
    }),
  ]);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 uppercase tracking-tight">
            HEADYZINE
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Stories, interviews, and news from the HEADY.FM universe
          </p>
        </div>

        {/* Articles Index */}
        <NewsIndex
          initialArticles={result?.articles ?? []}
          initialTotal={result?.total ?? 0}
          categories={categories ?? []}
          tags={tags ?? []}
        />
      </div>

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}
