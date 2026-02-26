import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { urlFor } from "@/lib/sanity/client";
import type { Article } from "@/lib/sanity/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const imageUrl = article.featuredImage
    ? urlFor(article.featuredImage).width(featured ? 800 : 600).height(featured ? 450 : 340).url()
    : null;

  return (
    <Link href={`/headyzine/${article.slug.current}`} className="group block">
      <article
        className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[hsl(150,55%,35%)]/50 transition-all duration-300 h-full flex flex-col ${
          featured ? "md:flex-row" : ""
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            featured
              ? "md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[320px]"
              : "aspect-[16/10]"
          }`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.featuredImage?.alt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(150,55%,35%)] to-[hsl(270,60%,25%)] flex items-center justify-center">
              <span className="text-white/40 text-6xl font-black">H</span>
            </div>
          )}

          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[hsl(150,55%,35%)] text-white">
                {article.category.title}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 flex flex-col flex-1 ${featured ? "md:w-1/2 md:p-8 md:justify-center" : ""}`}>
          {/* Meta */}
          <div className="flex items-center gap-4 text-white/50 text-sm mb-3">
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(article.publishedAt), "MMM d, yyyy")}
              </span>
            )}
            {article.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-white mb-3 group-hover:text-[hsl(150,55%,35%)] transition-colors leading-tight ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className={`text-white/60 text-sm mb-4 ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
              {article.excerpt}
            </p>
          )}

          {/* Author */}
          {article.author && (
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
              {article.author.image ? (
                <Image
                  src={urlFor(article.author.image).width(40).height(40).url()}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[hsl(150,55%,35%)]/30 flex items-center justify-center text-white/60 text-xs font-bold">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <span className="text-white/70 text-sm font-medium">{article.author.name}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
