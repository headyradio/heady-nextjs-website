"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, Share2, Check } from "lucide-react";
import { format } from "date-fns";
import { urlFor } from "@/lib/sanity/client";
import type { Article } from "@/lib/sanity/types";

interface ArticleMetaProps {
  article: Article;
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/headyzine/${slug}` : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/50 text-sm font-bold uppercase tracking-wider">Share</span>
      {/* X (Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Share on X"
      >
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[hsl(150,55%,35%)]" />
        ) : (
          <Share2 className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 md:py-2">
      {/* Left: Author / Date / Reading time */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Author */}
        {article.author && (
          <div className="flex items-center gap-2">
            {article.author.image ? (
              <Image
                src={urlFor(article.author.image).width(40).height(40).url()}
                alt={article.author.name}
                width={36}
                height={36}
                className="rounded-full border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[hsl(150,55%,35%)]/30 border border-[hsl(150,55%,35%)] flex items-center justify-center text-[hsl(150,55%,50%)] text-sm font-bold">
                {article.author.name.charAt(0)}
              </div>
            )}
            <span className="text-white font-medium text-base">{article.author.name}</span>
          </div>
        )}

        {/* Divider */}
        {article.author && <span className="text-white/20 hidden md:inline">•</span>}

        {/* Date */}
        {article.publishedAt && (
          <span className="flex items-center gap-1.5 text-white/50 text-sm">
            <Calendar className="w-4 h-4" />
            {format(new Date(article.publishedAt), "MMMM d, yyyy")}
          </span>
        )}

        {/* Reading Time */}
        {article.readingTime && (
          <span className="flex items-center gap-1.5 text-white/50 text-sm">
            <Clock className="w-4 h-4" />
            {article.readingTime} min read
          </span>
        )}
      </div>

      {/* Right: Share */}
      <ShareButtons title={article.title} slug={article.slug.current} />
    </div>
  );
}
