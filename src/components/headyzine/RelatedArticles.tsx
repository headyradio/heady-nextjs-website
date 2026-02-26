import { sanityFetch } from "@/lib/sanity/client";
import { relatedArticlesQuery } from "@/lib/sanity/queries";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/sanity/types";

interface RelatedArticlesProps {
  categorySlug: string;
  currentId: string;
}

export async function RelatedArticles({ categorySlug, currentId }: RelatedArticlesProps) {
  const articles = await sanityFetch<Article[]>({
    query: relatedArticlesQuery,
    params: { categorySlug, currentId },
    tags: ["articles"],
  });

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            You May Also Like...
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
