import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/client";
import {
  articleBySlugQuery,
  allArticleSlugsQuery,
} from "@/lib/sanity/queries";
import { ArticleHero } from "@/components/headyzine/ArticleHero";
import { ArticleBody } from "@/components/headyzine/ArticleBody";
import { ArticleMeta } from "@/components/headyzine/ArticleMeta";
import { RelatedArticles } from "@/components/headyzine/RelatedArticles";
import { TableOfContents } from "@/components/headyzine/TableOfContents";
import type { Article } from "@/lib/sanity/types";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: allArticleSlugsQuery,
    revalidate: 60,
  });

  return (slugs ?? []).map((slug) => ({ slug }));
}

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    tags: ["articles"],
  });

  if (!article) return { title: "Article Not Found" };

  const ogImage = article.seo?.openGraphImage
    ? urlFor(article.seo.openGraphImage).width(1200).height(630).url()
    : article.featuredImage
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
    alternates: {
      canonical: `https://heady.fm/headyzine/${slug}`,
    },
    openGraph: {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt || undefined,
      url: `https://heady.fm/headyzine/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      section: article.category?.title,
      tags: article.tags?.map((t) => t.title),
      authors: article.author ? [article.author.name] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    tags: ["articles"],
  });

  if (!article) notFound();

  // JSON-LD structured data — Article + BreadcrumbList in a @graph
  const articleImage = article.featuredImage
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article._updatedAt,
        url: `https://heady.fm/headyzine/${slug}`,
        ...(article.author && {
          author: {
            "@type": "Person",
            name: article.author.name,
          },
        }),
        publisher: {
          "@type": "Organization",
          name: "HEADY.FM",
          url: "https://heady.fm",
          logo: {
            "@type": "ImageObject",
            url: "https://heady.fm/favicon.png",
          },
        },
        ...(articleImage && { image: articleImage }),
        ...(article.category && {
          articleSection: article.category.title,
        }),
        ...(article.tags &&
          article.tags.length > 0 && {
            keywords: article.tags.map((t) => t.title).join(", "),
          }),
        ...(article.readingTime && {
          timeRequired: `PT${article.readingTime}M`,
        }),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://heady.fm/headyzine/${slug}`,
        },
        isPartOf: {
          "@type": "WebSite",
          name: "HEADY.FM",
          url: "https://heady.fm",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://heady.fm",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "HeadyZine",
            item: "https://heady.fm/headyzine",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `https://heady.fm/headyzine/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header (Editorial Layout) */}
      <div className="container mx-auto px-4 pt-6 pb-4 max-w-4xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/headyzine"
            className="inline-flex items-center gap-2 text-[hsl(150,55%,35%)] hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
        </div>

        {/* Category */}
        {article.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[hsl(150,55%,35%)] text-white mb-6">
            {article.category.title}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-white/60 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Meta Bar */}
        <ArticleMeta article={article} />
      </div>

      {/* Hero Image */}
      <div className="container mx-auto px-4 max-w-6xl mb-10">
        <ArticleHero article={article} />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-8 max-w-6xl">
        <div className="flex gap-10">
          {/* TOC Sidebar — hidden on mobile */}
          {article.body && (
            <aside className="hidden lg:block w-56 shrink-0">
              <TableOfContents body={article.body} />
            </aside>
          )}

          {/* Article Body */}
          <article className="min-w-0 flex-1 max-w-3xl mx-auto">
            {article.body && <ArticleBody body={article.body} />}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-white/50"
                    >
                      #{tag.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      {/* Related Articles */}
      {article.category?.slug?.current && (
        <Suspense fallback={null}>
          <RelatedArticles
            categorySlug={article.category.slug.current}
            currentId={article._id}
          />
        </Suspense>
      )}

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </main>
  );
}
