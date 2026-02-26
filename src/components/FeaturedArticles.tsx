import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import { latestArticlesQuery } from "@/lib/sanity/queries";
import { ArticleCard } from "@/components/headyzine/ArticleCard";
import type { Article } from "@/lib/sanity/types";

export async function FeaturedArticles() {
  const articles = await sanityFetch<Article[]>({
    query: latestArticlesQuery,
    params: { limit: 3 },
    tags: ["articles"],
  });

  if (!articles || articles.length === 0) return null;

  return (
    <section className="hidden md:block py-4 lg:py-6">
      <div className="px-4">
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 p-8 rounded-2xl border border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              HEADYZINE
            </h2>
            <Link
              href="/headyzine"
              className="inline-flex items-center gap-1.5 text-[hsl(150,55%,35%)] hover:text-white text-sm font-semibold transition-colors"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
