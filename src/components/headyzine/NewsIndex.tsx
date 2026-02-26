"use client";

import { useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./ArticleCard";
import type { Article, Category, Tag } from "@/lib/sanity/types";

interface NewsIndexProps {
  initialArticles: Article[];
  initialTotal: number;
  categories: Category[];
  tags: Tag[];
}

async function fetchArticles({
  page,
  category,
  tag,
}: {
  page: number;
  category: string;
  tag: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    ...(category && { category }),
    ...(tag && { tag }),
  });
  const res = await fetch(`/api/headyzine?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json() as Promise<{ articles: Article[]; total: number }>;
}

export function NewsIndex({
  initialArticles,
  initialTotal,
  categories,
  tags,
}: NewsIndexProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["headyzine-articles", activeCategory, activeTag],
    queryFn: ({ pageParam }) =>
      fetchArticles({ page: pageParam, category: activeCategory, tag: activeTag }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.articles.length, 0);
      return loaded < lastPage.total ? allPages.length : undefined;
    },
    initialData:
      activeCategory === "" && activeTag === ""
        ? {
            pages: [{ articles: initialArticles, total: initialTotal }],
            pageParams: [0],
          }
        : undefined,
    staleTime: 60_000,
  });

  const articles = data?.pages.flatMap((p) => p.articles) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const handleCategoryClick = useCallback(
    (slug: string) => {
      setActiveCategory((prev) => (prev === slug ? "" : slug));
      setActiveTag("");
    },
    []
  );

  const handleTagClick = useCallback(
    (slug: string) => {
      setActiveTag((prev) => (prev === slug ? "" : slug));
    },
    []
  );

  return (
    <div>
      {/* Filter Bar */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="mb-8 space-y-4">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setActiveCategory("");
                  setActiveTag("");
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === ""
                    ? "bg-[hsl(150,55%,35%)] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug.current)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.slug.current
                      ? "bg-[hsl(150,55%,35%)] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagClick(tag.slug.current)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    activeTag === tag.slug.current
                      ? "border-[hsl(150,55%,35%)] text-[hsl(150,55%,35%)] bg-[hsl(150,55%,35%)]/10"
                      : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
                  }`}
                >
                  #{tag.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[hsl(150,55%,35%)] animate-spin" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 font-semibold">Failed to load articles</p>
          <p className="text-white/50 text-sm mt-2">Please try again later.</p>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && articles.length > 0 && (
        <>
          {/* Featured first article */}
          {articles.length > 0 && (
            <div className="mb-8">
              <ArticleCard article={articles[0]} featured />
            </div>
          )}

          {/* Grid for remaining */}
          {articles.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 border border-white/20"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More Articles (${articles.length} of ${total})`
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && articles.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60 text-lg font-semibold">No articles available yet</p>
          <p className="text-white/40 text-sm mt-2">
            Check back soon for stories from the HEADY.FM universe
          </p>
        </div>
      )}
    </div>
  );
}
