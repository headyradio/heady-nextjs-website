"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { ArticleCard } from "@/components/headyzine/ArticleCard";
import type { Article } from "@/lib/sanity/types";

async function fetchLatestArticles(): Promise<Article[]> {
  const res = await fetch("/api/headyzine?page=0");
  if (!res.ok) return [];
  const data = await res.json();
  return (data.articles ?? []).slice(0, 3);
}

export function FeaturedArticlesClient() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: fetchLatestArticles,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[hsl(150,55%,35%)] animate-spin" />
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 p-8 rounded-2xl border border-white/10">
      {/* Promotional Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[hsl(150,55%,35%)] text-white">
              NEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              Introducing HEADYZINE
            </h2>
          </div>
          <p className="text-white/70 text-lg leading-relaxed font-medium">
            Music news, concert and tour dates, and stories about everything else worth caring about. It&apos;s a magazine with HEADY&apos;s signature element of surprise and edge.
          </p>
        </div>
        
        <Link
          href="/headyzine"
          className="inline-flex items-center gap-1.5 text-[hsl(150,55%,35%)] hover:text-white text-sm font-semibold transition-colors whitespace-nowrap"
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
  );
}
