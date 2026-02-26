import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { Article } from "@/lib/sanity/types";

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  const imageUrl = article.featuredImage
    ? urlFor(article.featuredImage).width(1600).height(900).url()
    : null;

  if (!imageUrl) return null;

  return (
    <section className="w-full">
      <div className="relative w-full aspect-[21/9] min-h-[300px] max-h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <Image
          src={imageUrl}
          alt={article.featuredImage?.alt || article.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </div>
      {article.featuredImage?.imageCredit && (
        <div className="mt-3 text-right">
          <span className="text-xs text-white/40 font-medium tracking-wide">
            Photo: {article.featuredImage.imageCredit}
          </span>
        </div>
      )}
    </section>
  );
}
